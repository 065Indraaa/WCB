/**
 * GET /api/locks/community
 *
 * Fetches ALL $WCB locks across all wallets from Streamflow
 * by querying the Streamflow program accounts filtered by mint = $WCB.
 *
 * Used to build the community leaderboard.
 * No Streamflow SDK — pure Helius RPC.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { calculateCredits } from '@/lib/lock';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump';
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? process.env.NEXT_PUBLIC_HELIUS_API_KEY ?? 'demo';
const RPC_URL = process.env.HELIUS_RPC_URL ?? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

const STREAMFLOW_PROGRAM = 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m';

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = await res.json() as { result?: unknown; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

function decodeStreamflowAccount(data: string): {
  mint: string;
  sender: string;
  depositedAmount: bigint;
  start: bigint;
  end: bigint;
} | null {
  try {
    const buf = Buffer.from(data, 'base64');
    if (buf.length < 128) return null;

    const readPubkey = (offset: number) => {
      const bytes = buf.slice(offset, offset + 32);
      const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      let num = BigInt('0x' + bytes.toString('hex'));
      let result = '';
      const base = BigInt(58);
      while (num > 0n) {
        result = ALPHABET[Number(num % base)] + result;
        num = num / base;
      }
      for (const byte of bytes) {
        if (byte === 0) result = '1' + result;
        else break;
      }
      return result;
    };

    return {
      sender: readPubkey(8),
      mint: readPubkey(96),
      start: buf.readBigUInt64LE(72),
      end: buf.readBigUInt64LE(80),
      depositedAmount: buf.readBigUInt64LE(88),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Get all Streamflow accounts where mint = $WCB (offset 96)
    const result = await rpc('getProgramAccounts', [
      STREAMFLOW_PROGRAM,
      {
        encoding: 'base64',
        filters: [
          { memcmp: { offset: 96, bytes: WCB_MINT } }, // mint = $WCB
        ],
      },
    ]) as Array<{ pubkey: string; account: { data: [string, string] } }>;

    const now = Math.floor(Date.now() / 1000);

    // Aggregate by wallet
    const walletMap = new Map<string, {
      wallet: string;
      totalLocked: number;
      totalCredits: number;
      activeLocks: number;
      locks: Array<{
        id: string;
        amount: number;
        durationDays: number;
        credits: number;
        isActive: boolean;
        endTs: number;
        streamflowUrl: string;
      }>;
    }>();

    for (const item of result ?? []) {
      const [data] = item.account.data;
      const decoded = decodeStreamflowAccount(data);
      if (!decoded) continue;
      if (decoded.mint !== WCB_MINT) continue;

      const decimals = 6;
      const amount = Number(decoded.depositedAmount) / Math.pow(10, decimals);
      const startTs = Number(decoded.start);
      const endTs = Number(decoded.end);
      const durationDays = Math.max(1, Math.round((endTs - startTs) / 86400));
      const isActive = endTs > now;
      const credits = calculateCredits(amount, durationDays);
      const wallet = decoded.sender;

      if (!walletMap.has(wallet)) {
        walletMap.set(wallet, { wallet, totalLocked: 0, totalCredits: 0, activeLocks: 0, locks: [] });
      }

      const entry = walletMap.get(wallet)!;
      entry.totalLocked += amount;
      entry.totalCredits += credits;
      if (isActive) entry.activeLocks += 1;
      entry.locks.push({
        id: item.pubkey,
        amount,
        durationDays,
        credits,
        isActive,
        endTs,
        streamflowUrl: `https://app.streamflow.finance/stream/solana/mainnet/${item.pubkey}`,
      });
    }

    const leaderboard = Array.from(walletMap.values())
      .sort((a, b) => b.totalCredits - a.totalCredits)
      .map((entry, i) => ({ rank: i + 1, ...entry }));

    const totals = {
      totalLocked: leaderboard.reduce((s, e) => s + e.totalLocked, 0),
      totalCredits: leaderboard.reduce((s, e) => s + e.totalCredits, 0),
      totalLockers: leaderboard.length,
    };

    return NextResponse.json({ leaderboard, totals });
  } catch (err) {
    console.error('[/api/locks/community] Error:', err);
    return NextResponse.json({
      leaderboard: [],
      totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 },
    }, { status: 500 });
  }
}

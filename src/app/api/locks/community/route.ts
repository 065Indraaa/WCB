/**
 * GET /api/locks/community
 *
 * Fetches ALL $WCB locks from Streamflow via Helius RPC.
 * Uses getProgramAccounts filtered by mint = $WCB mint address.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { calculateCredits } from '@/lib/lock';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump';
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? '';
const RPC_URL = process.env.HELIUS_RPC_URL
  ?? (HELIUS_KEY ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}` : 'https://api.mainnet-beta.solana.com');

const STREAMFLOW_PROGRAM = 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m';

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json() as { result?: unknown; error?: { message: string; code?: number } };
  if (json.error) throw new Error(`RPC error ${json.error.code}: ${json.error.message}`);
  return json.result;
}

/**
 * Decode a base64-encoded Streamflow account buffer.
 *
 * Streamflow v1 account layout (Solana, confirmed offsets):
 * Offset  0 -  7 : discriminator (8 bytes)
 * Offset  8 - 39 : sender pubkey (32 bytes)
 * Offset 40 - 71 : recipient pubkey (32 bytes)
 * Offset 72 - 79 : start_time u64 LE
 * Offset 80 - 87 : end_time u64 LE
 * Offset 88 - 95 : deposited_amount u64 LE
 * Offset 96 -127 : mint pubkey (32 bytes)
 */
function decodePubkey(buf: Buffer, offset: number): string {
  const bytes = buf.subarray(offset, offset + 32);
  // Base58 encode
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = 0n;
  for (const b of bytes) num = num * 256n + BigInt(b);
  let result = '';
  while (num > 0n) {
    result = ALPHABET[Number(num % 58n)] + result;
    num = num / 58n;
  }
  for (const b of bytes) {
    if (b !== 0) break;
    result = '1' + result;
  }
  return result;
}

function decodeU64LE(buf: Buffer, offset: number): number {
  // Read 8 bytes little-endian as number (safe for timestamps and token amounts)
  let val = 0;
  for (let i = 0; i < 8; i++) {
    val += (buf[offset + i] ?? 0) * Math.pow(256, i);
  }
  return val;
}

function decodeAccount(base64Data: string): {
  sender: string;
  mint: string;
  depositedAmount: number;
  startTs: number;
  endTs: number;
} | null {
  try {
    const buf = Buffer.from(base64Data, 'base64');
    if (buf.length < 128) return null;

    return {
      sender:          decodePubkey(buf, 8),
      mint:            decodePubkey(buf, 96),
      startTs:         decodeU64LE(buf, 72),
      endTs:           decodeU64LE(buf, 80),
      depositedAmount: decodeU64LE(buf, 88),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const debugInfo: Record<string, unknown> = {
    rpcUrl: RPC_URL.replace(/api-key=[^&]+/, 'api-key=***'),
    mint: WCB_MINT,
    program: STREAMFLOW_PROGRAM,
  };

  try {
    // getProgramAccounts: filter by mint pubkey at offset 96
    // The `bytes` field in memcmp must be the base58-encoded pubkey string
    const result = await rpcCall('getProgramAccounts', [
      STREAMFLOW_PROGRAM,
      {
        encoding: 'base64',
        filters: [
          {
            memcmp: {
              offset: 96,
              bytes: WCB_MINT, // base58 pubkey string — Solana RPC accepts this directly
            },
          },
        ],
      },
    ]) as Array<{ pubkey: string; account: { data: [string, string] } }> | null;

    debugInfo.accountsFound = result?.length ?? 0;

    const now = Math.floor(Date.now() / 1000);
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
      const decoded = decodeAccount(data);
      if (!decoded) continue;
      if (decoded.mint !== WCB_MINT) continue;

      const decimals = 6;
      const amount = decoded.depositedAmount / Math.pow(10, decimals);
      const { startTs, endTs } = decoded;
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
      totalLocked:  leaderboard.reduce((s, e) => s + e.totalLocked, 0),
      totalCredits: leaderboard.reduce((s, e) => s + e.totalCredits, 0),
      totalLockers: leaderboard.length,
    };

    return NextResponse.json({ leaderboard, totals, _debug: debugInfo });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[/api/locks/community]', message);
    return NextResponse.json(
      {
        leaderboard: [],
        totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 },
        error: message,
        _debug: debugInfo,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/locks/community
 *
 * Returns active $WCB Streamflow lock positions aggregated by wallet.
 * Holder ranking is intentionally handled by /api/leaderboard, so this route
 * only represents wallets with real Streamflow locks for the configured mint.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { calculateCredits } from '@/lib/lock';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? '';
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL ?? 'https://mainnet.helius-rpc.com';
const STREAMFLOW_PROGRAM = 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m';
const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS ?? 6);

type StreamflowLock = {
  id: string;
  amount: number;
  durationDays: number;
  credits: number;
  isActive: boolean;
  endTs: number;
  streamflowUrl: string;
};

type WalletLocks = {
  wallet: string;
  locks: StreamflowLock[];
};

function buildRpcUrl() {
  if (!HELIUS_KEY || HELIUS_KEY === 'your_helius_api_key_here') {
    return 'https://api.mainnet-beta.solana.com';
  }

  if (HELIUS_RPC_URL.includes('api-key=')) return HELIUS_RPC_URL;
  const separator = HELIUS_RPC_URL.includes('?') ? '&' : HELIUS_RPC_URL.endsWith('/') ? '?' : '/?';
  return `${HELIUS_RPC_URL}${separator}api-key=${HELIUS_KEY}`;
}

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(buildRpcUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json() as { result?: unknown; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

function decodePubkey(buf: Buffer, offset: number): string {
  const bytes = buf.subarray(offset, offset + 32);
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let num = 0n;

  for (const b of bytes) num = num * 256n + BigInt(b);

  let result = '';
  while (num > 0n) {
    result = alphabet[Number(num % 58n)] + result;
    num = num / 58n;
  }

  for (const b of bytes) {
    if (b !== 0) break;
    result = '1' + result;
  }

  return result;
}

function decodeU64LE(buf: Buffer, offset: number): number {
  let value = 0;
  for (let i = 0; i < 8; i++) value += (buf[offset + i] ?? 0) * Math.pow(256, i);
  return value;
}

function decodeStreamflowAccount(base64Data: string): {
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
      sender: decodePubkey(buf, 8),
      startTs: decodeU64LE(buf, 72),
      endTs: decodeU64LE(buf, 80),
      depositedAmount: decodeU64LE(buf, 88),
      mint: decodePubkey(buf, 96),
    };
  } catch {
    return null;
  }
}

export async function GET() {
  if (!WCB_MINT || WCB_MINT === 'your_token_contract_address_here') {
    return NextResponse.json({
      leaderboard: [],
      totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 },
      source: 'not-configured',
    });
  }

  try {
    const streamAccounts = await rpcCall('getProgramAccounts', [
      STREAMFLOW_PROGRAM,
      {
        encoding: 'base64',
        filters: [{ memcmp: { offset: 96, bytes: WCB_MINT } }],
      },
    ]) as Array<{ pubkey: string; account: { data: [string, string] } }> | null;

    const now = Math.floor(Date.now() / 1000);
    const byWallet = new Map<string, WalletLocks>();

    for (const item of streamAccounts ?? []) {
      const decoded = decodeStreamflowAccount(item.account.data[0]);
      if (!decoded || decoded.mint !== WCB_MINT || decoded.endTs <= now) continue;

      const amount = decoded.depositedAmount / Math.pow(10, TOKEN_DECIMALS);
      if (!Number.isFinite(amount) || amount <= 0) continue;

      const durationDays = Math.max(1, Math.round((decoded.endTs - decoded.startTs) / 86_400));
      const lock: StreamflowLock = {
        id: item.pubkey,
        amount,
        durationDays,
        credits: calculateCredits(amount, durationDays),
        isActive: true,
        endTs: decoded.endTs,
        streamflowUrl: `https://app.streamflow.finance/stream/solana/mainnet/${item.pubkey}`,
      };

      const walletLocks = byWallet.get(decoded.sender) ?? { wallet: decoded.sender, locks: [] };
      walletLocks.locks.push(lock);
      byWallet.set(decoded.sender, walletLocks);
    }

    const leaderboard = Array.from(byWallet.values())
      .map((entry) => {
        const sortedLocks = [...entry.locks].sort((a, b) => b.credits - a.credits);
        const totalLocked = sortedLocks.reduce((sum, lock) => sum + lock.amount, 0);
        const totalCredits = sortedLocks.reduce((sum, lock) => sum + lock.credits, 0);

        return {
          rank: 0,
          wallet: entry.wallet,
          displayWallet: `${entry.wallet.slice(0, 6)}...${entry.wallet.slice(-6)}`,
          holdings: totalLocked,
          totalLocked,
          totalCredits,
          activeLocks: sortedLocks.length,
          locks: sortedLocks.slice(0, 3),
          streamflowUrl: sortedLocks[0]?.streamflowUrl
            ?? `https://app.streamflow.finance/token-dashboard/solana/mainnet/${WCB_MINT}?type=lock`,
        };
      })
      .sort((a, b) => {
        if (b.totalCredits !== a.totalCredits) return b.totalCredits - a.totalCredits;
        return b.totalLocked - a.totalLocked;
      });

    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const totals = {
      totalLocked: leaderboard.reduce((sum, entry) => sum + entry.totalLocked, 0),
      totalCredits: leaderboard.reduce((sum, entry) => sum + entry.totalCredits, 0),
      totalLockers: leaderboard.length,
    };

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, 100),
      totals,
      source: 'streamflow-program',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[/api/locks/community]', message);
    return NextResponse.json(
      { leaderboard: [], totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 }, error: message },
      { status: 500 },
    );
  }
}

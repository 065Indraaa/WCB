/**
 * GET /api/locks/community
 *
 * Returns top 10 WCB token holders from on-chain data via Helius.
 * Uses getTokenLargestAccounts (fast, no pagination needed).
 *
 * For each holder we also check if they have Streamflow locks
 * by querying the Streamflow program for their wallet.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { calculateCredits } from '@/lib/lock';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? '';
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? '';
const RPC_URL = HELIUS_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`
  : 'https://api.mainnet-beta.solana.com';

const STREAMFLOW_PROGRAM = 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m';

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const json = await res.json() as { result?: unknown; error?: { message: string } };
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

function decodePubkey(buf: Buffer, offset: number): string {
  const bytes = buf.subarray(offset, offset + 32);
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
  let val = 0;
  for (let i = 0; i < 8; i++) val += (buf[offset + i] ?? 0) * Math.pow(256, i);
  return val;
}

function decodeStreamflowAccount(base64Data: string): {
  sender: string; mint: string; depositedAmount: number; startTs: number; endTs: number;
} | null {
  try {
    const buf = Buffer.from(base64Data, 'base64');
    if (buf.length < 128) return null;
    return {
      sender: decodePubkey(buf, 8),
      mint: decodePubkey(buf, 96),
      startTs: decodeU64LE(buf, 72),
      endTs: decodeU64LE(buf, 80),
      depositedAmount: decodeU64LE(buf, 88),
    };
  } catch { return null; }
}

export async function GET() {
  try {
    // Step 1: Get top 20 WCB token holders (fast RPC call)
    const largestAccounts = await rpcCall('getTokenLargestAccounts', [WCB_MINT]) as {
      value: Array<{ address: string; amount: string; decimals: number; uiAmount: number; uiAmountString: string }>;
    };

    const topAccounts = largestAccounts.value.slice(0, 20);

    // Step 2: For each token account, get the wallet owner
    const holderMap = new Map<string, { wallet: string; tokenAccount: string; amount: number }>();

    await Promise.all(
      topAccounts.map(async (acc) => {
        try {
          const info = await rpcCall('getAccountInfo', [acc.address, { encoding: 'jsonParsed' }]) as {
            value: { data: { parsed: { info: { owner: string; tokenAmount: { uiAmount: number } } } } } | null;
          };
          const owner = info?.value?.data?.parsed?.info?.owner;
          const amount = acc.uiAmount ?? 0;
          if (owner && amount > 0) {
            // Aggregate by wallet (some wallets have multiple token accounts)
            const existing = holderMap.get(owner);
            if (!existing || existing.amount < amount) {
              holderMap.set(owner, { wallet: owner, tokenAccount: acc.address, amount });
            }
          }
        } catch { /* skip */ }
      })
    );

    // Step 3: For each wallet, check Streamflow locks
    const leaderboard = [];
    let rank = 1;

    for (const [wallet, holderData] of holderMap) {
      if (rank > 10) break;

      // Try to find Streamflow locks for this wallet
      let streamflowLocks: Array<{
        id: string; amount: number; durationDays: number; credits: number;
        isActive: boolean; endTs: number; streamflowUrl: string;
      }> = [];

      try {
        const streamAccounts = await rpcCall('getProgramAccounts', [
          STREAMFLOW_PROGRAM,
          {
            encoding: 'base64',
            filters: [{ memcmp: { offset: 8, bytes: wallet } }], // sender = wallet
          },
        ]) as Array<{ pubkey: string; account: { data: [string, string] } }> | null;

        const now = Math.floor(Date.now() / 1000);
        for (const item of streamAccounts ?? []) {
          const decoded = decodeStreamflowAccount(item.account.data[0]);
          if (!decoded || decoded.mint !== WCB_MINT) continue;
          const decimals = 6;
          const amount = decoded.depositedAmount / Math.pow(10, decimals);
          const durationDays = Math.max(1, Math.round((decoded.endTs - decoded.startTs) / 86400));
          streamflowLocks.push({
            id: item.pubkey,
            amount,
            durationDays,
            credits: calculateCredits(amount, durationDays),
            isActive: decoded.endTs > now,
            endTs: decoded.endTs,
            streamflowUrl: `https://app.streamflow.finance/stream/solana/mainnet/${item.pubkey}`,
          });
        }
      } catch { /* no locks found */ }

      const totalLocked = streamflowLocks.reduce((s, l) => s + l.amount, 0);
      const totalCredits = streamflowLocks.reduce((s, l) => s + l.credits, 0);

      leaderboard.push({
        rank,
        wallet,
        displayWallet: `${wallet.slice(0, 6)}...${wallet.slice(-6)}`,
        holdings: holderData.amount,
        totalLocked: totalLocked > 0 ? totalLocked : holderData.amount,
        totalCredits: totalCredits > 0 ? totalCredits : calculateCredits(holderData.amount, 30),
        activeLocks: streamflowLocks.filter(l => l.isActive).length,
        locks: streamflowLocks.slice(0, 3), // top 3 locks per wallet
        streamflowUrl: streamflowLocks.length > 0
          ? streamflowLocks[0].streamflowUrl
          : `https://app.streamflow.finance/token-dashboard/solana/mainnet/${WCB_MINT}?type=lock`,
      });

      rank++;
    }

    // Sort by holdings descending
    leaderboard.sort((a, b) => b.holdings - a.holdings);
    leaderboard.forEach((e, i) => { e.rank = i + 1; });

    const totals = {
      totalLocked: leaderboard.reduce((s, e) => s + e.totalLocked, 0),
      totalCredits: leaderboard.reduce((s, e) => s + e.totalCredits, 0),
      totalLockers: leaderboard.length,
    };

    return NextResponse.json({ leaderboard, totals });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[/api/locks/community]', message);
    return NextResponse.json(
      { leaderboard: [], totals: { totalLocked: 0, totalCredits: 0, totalLockers: 0 }, error: message },
      { status: 500 },
    );
  }
}

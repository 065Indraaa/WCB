/**
 * GET /api/locks?wallet=<address>
 *
 * Fetches $WCB locks for a wallet by querying Streamflow accounts
 * directly via Helius RPC — no Streamflow SDK needed.
 *
 * Streamflow stores each lock as a Solana account owned by the
 * Streamflow program. We use getProgramAccounts with a memcmp filter
 * on the sender field to find locks belonging to a wallet.
 *
 * Streamflow Solana program: strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { calculateCredits } from '@/lib/lock';

const WCB_MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump';
const HELIUS_KEY = process.env.HELIUS_API_KEY ?? process.env.NEXT_PUBLIC_HELIUS_API_KEY ?? 'demo';
const RPC_URL = process.env.HELIUS_RPC_URL ?? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

// Streamflow program ID on Solana mainnet
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

/** Decode a base64 Streamflow account to extract key fields */
function decodeStreamflowAccount(data: string): {
  mint: string;
  sender: string;
  depositedAmount: bigint;
  start: bigint;
  end: bigint;
} | null {
  try {
    const buf = Buffer.from(data, 'base64');
    // Streamflow account layout (simplified — key offsets):
    // [0..8]   discriminator
    // [8..40]  sender pubkey (32 bytes)
    // [40..72] recipient pubkey (32 bytes)
    // [72..80] start timestamp (u64 LE)
    // [80..88] end timestamp (u64 LE)
    // [88..96] deposited amount (u64 LE)
    // [96..128] mint pubkey (32 bytes)
    // Note: actual layout may vary by Streamflow version.
    // We use a best-effort decode; if it fails we skip the account.

    if (buf.length < 128) return null;

    const readPubkey = (offset: number) => {
      const bytes = buf.slice(offset, offset + 32);
      // Base58 encode
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

    const readU64LE = (offset: number) =>
      buf.readBigUInt64LE(offset);

    return {
      sender: readPubkey(8),
      mint: readPubkey(96),
      start: readU64LE(72),
      end: readU64LE(80),
      depositedAmount: readU64LE(88),
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'wallet parameter required' }, { status: 400 });
  }

  try {
    // Query Streamflow program accounts filtered by sender = wallet
    // Offset 8 = start of sender pubkey field
    const walletBytes = Buffer.from(
      // Decode base58 wallet address to bytes
      (() => {
        const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const bytes = new Uint8Array(32);
        let n = 0n;
        for (const char of wallet) {
          const idx = ALPHABET.indexOf(char);
          if (idx < 0) throw new Error('Invalid base58');
          n = n * 58n + BigInt(idx);
        }
        const hex = n.toString(16).padStart(64, '0');
        for (let i = 0; i < 32; i++) {
          bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }
        return bytes;
      })()
    );

    const result = await rpc('getProgramAccounts', [
      STREAMFLOW_PROGRAM,
      {
        encoding: 'base64',
        filters: [
          { memcmp: { offset: 8, bytes: wallet } }, // sender = wallet
        ],
      },
    ]) as Array<{ pubkey: string; account: { data: [string, string] } }>;

    const now = Math.floor(Date.now() / 1000);
    const locks = [];

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

      locks.push({
        id: item.pubkey,
        wallet,
        amount,
        startTs,
        endTs,
        durationDays,
        credits: calculateCredits(amount, durationDays),
        isActive,
        mint: decoded.mint,
        streamflowUrl: `https://app.streamflow.finance/stream/solana/mainnet/${item.pubkey}`,
      });
    }

    locks.sort((a, b) => b.credits - a.credits);
    return NextResponse.json({ locks, total: locks.length });

  } catch (err) {
    console.error('[/api/locks] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch locks', locks: [], total: 0 }, { status: 500 });
  }
}

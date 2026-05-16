import { redirect } from 'next/navigation';
import { WCB_MINT } from '@/lib/tokenConfig';

const DEXSCREENER_URL =
  process.env.NEXT_PUBLIC_DEXSCREENER_URL ?? `https://dexscreener.com/solana/${WCB_MINT}`;

export default function TokenPage() {
  redirect(DEXSCREENER_URL);
}

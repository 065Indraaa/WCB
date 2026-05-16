import { TokenDexscreenerChart } from '@/components/token/TokenDexscreenerChart';
import { WCB_MINT } from '@/lib/tokenConfig';

export default function TokenPage() {
  return <TokenDexscreenerChart tokenAddress={WCB_MINT} />;
}

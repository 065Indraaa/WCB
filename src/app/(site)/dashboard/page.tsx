'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/live-bets');
  }, [router]);
  return (
    <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#B3B3B3' }}>
      Redirecting to live bets…
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Shows a welcome toast when user arrives at /lock after connecting wallet.
 * Triggered by ?welcome=1 query param.
 */
export function WelcomeToast() {
  const params = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (params.get('welcome') === '1') {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }
  }, [params]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{
            position: 'fixed',
            top: '5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            background: '#111111',
            color: '#ffffff',
            padding: '0.875rem 1.5rem',
            borderRadius: 14,
            border: '1px solid rgba(242,181,68,0.28)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.42)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '90vw',
            whiteSpace: 'nowrap',
          }}
          role="status"
          aria-live="polite"
        >
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0 }}>
              Wallet connected.
            </p>
            <p style={{ fontSize: '0.78rem', opacity: 0.88, margin: 0 }}>
              Lock $WCB to review your credit position before June 11.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', marginLeft: '0.25rem' }}
            aria-label="Dismiss"
          >
            x
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

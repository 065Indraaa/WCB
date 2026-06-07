'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#070707',
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EF4444', marginBottom: '1rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#B3B3B3', maxWidth: '28rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      {error.digest && (
        <p style={{ fontSize: '0.75rem', color: '#6E6E6E', marginBottom: '1.5rem' }}>
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          padding: '0.625rem 1.25rem',
          borderRadius: 8,
          background: '#F2B544',
          color: '#070707',
          fontWeight: 800,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}

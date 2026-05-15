import type { ReactNode } from 'react';

export function WcbMark({ children = '$WCB' }: { children?: ReactNode }) {
  return (
    <span className="wcb-mark">
      {children}
    </span>
  );
}

export function WcbText({ children }: { children: string }) {
  const parts = children.split('$WCB');

  if (parts.length === 1) return <>{children}</>;

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 && <WcbMark />}
        </span>
      ))}
    </>
  );
}

import type { ReactNode } from 'react';

type WcbTone = 'accent' | 'hero' | 'inherit';

export function WcbMark({
  children = '$WCB',
  tone = 'accent',
}: {
  children?: ReactNode;
  tone?: WcbTone;
}) {
  const className =
    tone === 'hero'
      ? 'wcb-mark wcb-mark-hero'
      : tone === 'inherit'
        ? 'wcb-mark wcb-mark-inherit'
        : 'wcb-mark';

  return (
    <span className={className}>
      {children}
    </span>
  );
}

export function WcbText({ children, tone = 'accent' }: { children: string; tone?: WcbTone }) {
  const parts = children.split('$WCB');

  if (parts.length === 1) return <>{children}</>;

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 && <WcbMark tone={tone} />}
        </span>
      ))}
    </>
  );
}

import type { SVGProps } from 'react';

export type MenuIconName =
  | 'home'
  | 'matches'
  | 'groups'
  | 'bracket'
  | 'token'
  | 'lock'
  | 'docs'
  | 'leaderboard';

type MenuIconProps = SVGProps<SVGSVGElement> & {
  name: MenuIconName;
};

export function MenuIcon({ name, ...props }: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {name === 'home' && (
        <>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.75V20h12V9.75" />
          <path d="M10 20v-5h4v5" />
        </>
      )}
      {name === 'matches' && (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2.2" />
          <path d="M4 9.5h16" />
          <path d="M8 3.5v3" />
          <path d="M16 3.5v3" />
          <path d="M8 13h4" />
          <path d="M8 16h8" />
        </>
      )}
      {name === 'groups' && (
        <>
          <rect x="4" y="5" width="6" height="6" rx="1.2" />
          <rect x="14" y="5" width="6" height="6" rx="1.2" />
          <rect x="4" y="15" width="6" height="6" rx="1.2" />
          <rect x="14" y="15" width="6" height="6" rx="1.2" />
        </>
      )}
      {name === 'bracket' && (
        <>
          <path d="M8 4h8v2.5A3.5 3.5 0 0 1 12.5 10H11A3 3 0 0 1 8 7V4Z" />
          <path d="M9 18h6" />
          <path d="M10 10v4a2 2 0 0 1-2 2H6" />
          <path d="M14 10v4a2 2 0 0 0 2 2h2" />
          <path d="M10 14v4" />
          <path d="M14 14v4" />
        </>
      )}
      {name === 'token' && (
        <>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 8.5v7" />
          <path d="M9.5 12h5" />
          <path d="M12 5.5v2" />
        </>
      )}
      {name === 'lock' && (
        <>
          <path d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2" />
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M12 13.5v3" />
        </>
      )}
      {name === 'docs' && (
        <>
          <path d="M8 4h7l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M15 4v4h4" />
          <path d="M9.5 11h5" />
          <path d="M9.5 14h5" />
        </>
      )}
      {name === 'leaderboard' && (
        <>
          <path d="M6 19V11" />
          <path d="M12 19V6" />
          <path d="M18 19v-9" />
          <path d="M4.5 19h15" />
        </>
      )}
    </svg>
  );
}

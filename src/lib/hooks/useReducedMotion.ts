'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Wrapper around Framer Motion's useReducedMotion.
 * Returns true when the user has prefers-reduced-motion enabled.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

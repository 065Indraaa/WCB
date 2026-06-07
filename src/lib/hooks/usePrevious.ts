'use client';

import { useEffect, useRef } from 'react';

/**
 * Returns the value from the previous render.
 * Used to detect balance/odds increases vs decreases for flash animations.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

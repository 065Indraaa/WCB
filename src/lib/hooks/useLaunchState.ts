'use client';
import { useState, useEffect } from 'react';
import { getLaunchState, type LaunchState } from '@/lib/utils/launchState';

export function useLaunchState(): LaunchState {
  const [state, setState] = useState<LaunchState>(() => getLaunchState());

  useEffect(() => {
    // Re-check every minute so the UI transitions automatically at phase boundaries
    const interval = setInterval(() => {
      setState(getLaunchState());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return state;
}

'use client';

import { useEffect, useRef } from 'react';

export function BackgroundSong() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let started = false;

    const removeFallbackListeners = () => {
      window.removeEventListener('pointerdown', playSong);
      window.removeEventListener('keydown', playSong);
      window.removeEventListener('touchstart', playSong);
    };

    const playSong = () => {
      if (started) return;
      audio.volume = 0.35;
      void audio
        .play()
        .then(() => {
          started = true;
          removeFallbackListeners();
        })
        .catch(() => {
          /* Browser autoplay policy may require the first user interaction. */
        });
    };

    const timer = window.setTimeout(playSong, 200);
    window.addEventListener('pointerdown', playSong, { once: true });
    window.addEventListener('keydown', playSong, { once: true });
    window.addEventListener('touchstart', playSong, { once: true });

    return () => {
      window.clearTimeout(timer);
      removeFallbackListeners();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/song.mp3"
      autoPlay
      preload="auto"
      playsInline
      aria-hidden="true"
      style={{ display: 'none' }}
    />
  );
}

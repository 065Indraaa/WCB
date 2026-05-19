'use client';

import { useEffect, useRef, useState } from 'react';

export function BackgroundSong() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let started = false;
    audio.volume = 0.35;
    audio.loop = true;
    audio.load();

    const removeFallbackListeners = () => {
      window.removeEventListener('pointerdown', playSong);
      window.removeEventListener('keydown', playSong);
      window.removeEventListener('touchstart', playSong);
      window.removeEventListener('touchend', playSong);
      window.removeEventListener('click', playSong);
    };

    const playSong = () => {
      if (started) return;
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

    playSong();
    window.addEventListener('pointerdown', playSong);
    window.addEventListener('keydown', playSong);
    window.addEventListener('touchstart', playSong);
    window.addEventListener('touchend', playSong);
    window.addEventListener('click', playSong);

    // Listen for toggle events from the Navbar mute button
    const handleToggle = () => {
      setMuted((prev) => {
        const next = !prev;
        if (audio) audio.muted = next;
        return next;
      });
    };

    window.addEventListener('wcb:toggleAudio', handleToggle);

    return () => {
      removeFallbackListeners();
      window.removeEventListener('wcb:toggleAudio', handleToggle);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/song.mp3"
      autoPlay
      loop
      preload="auto"
      playsInline
      muted={muted}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

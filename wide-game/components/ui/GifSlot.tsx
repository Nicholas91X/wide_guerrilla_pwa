'use client';

import { useState } from 'react';

type SlotState = 'gif' | 'mp4' | 'error';

interface Props {
  name?: string;
  pool?: readonly string[];
  className?: string;
}

function pickRandom(pool: readonly string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function GifSlot({ name, pool, className = '' }: Props) {
  const [resolvedName] = useState<string>(() => {
    if (pool && pool.length > 0) return pickRandom(pool);
    return name ?? '';
  });

  const [state, setState] = useState<SlotState>('gif');

  const wrapperClass = `w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gold/10 ${className}`;

  if (!resolvedName || state === 'error') {
    return (
      <div
        className={`w-full aspect-[3/2] bg-gold/10 border border-gold/35 rounded-2xl flex flex-col items-center justify-center gap-1 ${className}`}
      >
        <span className="text-foreground-muted/50 text-[10px] font-body uppercase tracking-widest">
          media
        </span>
        <span className="text-foreground-muted text-xs font-body">
          {resolvedName || name}
        </span>
      </div>
    );
  }

  if (state === 'mp4') {
    return (
      <div className={wrapperClass}>
        <video
          src={`/gifs/${resolvedName}.mp4`}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setState('error')}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Tentativo gif → fallback mp4
  return (
    <div className={wrapperClass}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/gifs/${resolvedName}.gif`}
        alt={resolvedName}
        onError={() => setState('mp4')}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}

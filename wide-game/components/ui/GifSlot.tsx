'use client';

import { useState } from 'react';

type SlotState = 'gif' | 'mp4' | 'error';

interface Props {
  name: string;
  className?: string;
}

export default function GifSlot({ name, className = '' }: Props) {
  const [state, setState] = useState<SlotState>('gif');

  const wrapperClass = `w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gold/5 ${className}`;

  if (state === 'error') {
    return (
      <div
        className={`w-full aspect-[3/2] bg-gold/5 border border-gold/20 rounded-2xl flex flex-col items-center justify-center gap-1 ${className}`}
      >
        <span className="text-foreground-muted/50 text-[10px] font-body uppercase tracking-widest">
          media
        </span>
        <span className="text-foreground-muted text-xs font-body">
          {name}.gif
        </span>
      </div>
    );
  }

  if (state === 'mp4') {
    return (
      <div className={wrapperClass}>
        <video
          src={`/gifs/${name}.mp4`}
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

  // Tentativo gif — se fallisce prova mp4
  return (
    <div className={wrapperClass}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/gifs/${name}.gif`}
        alt={name}
        onError={() => setState('mp4')}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}

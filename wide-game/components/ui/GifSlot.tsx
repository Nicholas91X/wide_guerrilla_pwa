'use client';

import { useState } from 'react';

interface Props {
  name: string;
  className?: string;
}

export default function GifSlot({ name, className = '' }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`w-full aspect-[3/2] bg-gold/5 border border-gold/20 rounded-2xl flex flex-col items-center justify-center gap-1 ${className}`}
      >
        <span className="text-foreground-muted/50 text-[10px] font-body uppercase tracking-widest">
          gif
        </span>
        <span className="text-foreground-muted text-xs font-body">
          {name}.gif
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gold/5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/gifs/${name}.gif`}
        alt={name}
        onError={() => setErrored(true)}
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  );
}

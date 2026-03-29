'use client';

import { useState, useEffect } from 'react';

interface Props {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onDone?: () => void;
}

export default function Typewriter({ text, speed = 16, className, onDone }: Props) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!text) return;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed, onDone]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-[1em] bg-gold align-middle ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

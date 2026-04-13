'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  /** Se true, la prima frase viene resa in oro e corsivo (titolo) */
  hasTitle?: boolean;
  onDone?: () => void;
}

function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const normalized = text.replace(/\n\n+/g, '.|');
  const parts = normalized.split(/\.\s+|\.\|/);
  return parts
    .map((p, i) => {
      const t = p.trim();
      if (!t) return null;
      const endsWithPunct = /[.!?]$/.test(t);
      return i < parts.length - 1 && !endsWithPunct ? t + '.' : t;
    })
    .filter(Boolean) as string[];
}

export default function TypewriterBlock({ text, speed = 14, hasTitle = false, onDone }: Props) {
  const [displayed, setDisplayed] = useState('');

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    setDisplayed('');
    if (!text) return;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDoneRef.current?.();
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  const sentences = splitIntoSentences(displayed);
  const isTyping = displayed.length < text.length;

  return (
    <div>
      {sentences.map((sentence, i) => {
        const isLast = i === sentences.length - 1;

        return (
          <p
            key={i}
            className={[
              'font-body leading-relaxed mb-3',
              hasTitle && i === 0
                ? 'font-display text-gold italic text-base font-semibold tracking-wide'
                : 'text-foreground/90 text-sm',
            ].join(' ')}
          >
            {sentence}
            {isLast && isTyping && (
              <span className="inline-block w-px h-[0.85em] bg-gold align-middle ml-0.5 animate-pulse" />
            )}
          </p>
        );
      })}
    </div>
  );
}

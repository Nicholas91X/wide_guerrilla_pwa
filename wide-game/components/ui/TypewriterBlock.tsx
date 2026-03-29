'use client';

import { useState, useEffect } from 'react';

interface Props {
  text: string;
  speed?: number;
  /** Se true, la prima frase viene resa in oro e grassetto (frase titolo in CAPS) */
  hasTitle?: boolean;
  onDone?: () => void;
}

/**
 * Divide il testo in frasi (split su ". " e "\n\n") e le anima
 * carattere per carattere. Ogni frase va a capo come paragrafo separato.
 */
function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Normalizza le doppie newline in separatore uniforme
  const normalized = text.replace(/\n\n+/g, '.|');
  // Split su '. ' oppure '.|' (nostro separatore paragrafo)
  const parts = normalized.split(/\.\s+|\.\|/);
  return parts
    .map((p, i) => {
      const t = p.trim();
      if (!t) return null;
      // Riattacca il punto se non è l'ultimo pezzo già terminante con punteggiatura
      const endsWithPunct = /[.!?]$/.test(t);
      return i < parts.length - 1 && !endsWithPunct ? t + '.' : t;
    })
    .filter(Boolean) as string[];
}

export default function TypewriterBlock({ text, speed = 14, hasTitle = false, onDone }: Props) {
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

  const sentences = splitIntoSentences(displayed);
  const isTyping = displayed.length < text.length;

  return (
    <div>
      {sentences.map((sentence, i) => {
        const isFirst = i === 0;
        const isLast = i === sentences.length - 1;

        return (
          <p
            key={i}
            className={[
              'font-body text-base leading-relaxed mb-3',
              hasTitle && isFirst
                ? 'text-gold font-semibold tracking-wide'
                : 'text-foreground',
            ].join(' ')}
          >
            {sentence}
            {isLast && isTyping && (
              <span className="inline-block w-0.5 h-[1em] bg-gold align-middle ml-0.5 animate-pulse" />
            )}
          </p>
        );
      })}
    </div>
  );
}

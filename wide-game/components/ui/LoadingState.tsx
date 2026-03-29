'use client';

import { useEffect, useState } from 'react';

interface Props {
  message?: string;
}

// Contatore di perdite in tempo reale — tematico e leggero
export default function LoadingState({ message = 'Un momento...' }: Props) {
  const [loss, setLoss] = useState(0);

  useEffect(() => {
    // Incrementa le "perdite" ogni ~80ms, valore random tra 37 e 1400 €
    const id = setInterval(() => {
      setLoss((prev) => prev + Math.floor(Math.random() * 1363 + 37));
    }, 80);
    return () => clearInterval(id);
  }, []);

  const formatted = loss.toLocaleString('it-IT');

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-12">
      {/* Grafico ASCII che scende */}
      <div className="font-body text-gold/60 text-xs leading-none select-none" aria-hidden>
        <div>▁▂▃▄▅▆▇ █</div>
        <div className="text-right mt-0.5 text-gold/30">▇▆▅▄▃▂▁ ▁</div>
      </div>

      {/* Contatore perdite */}
      <div className="text-center">
        <p className="text-foreground-muted text-[10px] font-body uppercase tracking-widest mb-1">
          Perdite in corso
        </p>
        <p className="text-gold font-display text-2xl tabular-nums">
          −€{formatted}
        </p>
      </div>

      <p className="text-foreground-muted text-sm font-body">{message}</p>
    </div>
  );
}

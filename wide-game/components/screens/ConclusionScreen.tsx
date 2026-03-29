'use client';

import { useGame } from '@/contexts/GameContext';

export default function ConclusionScreen() {
  const { state, proceedToContact } = useGame();
  if (!state || !state.conclusion) return null;

  const paragraphs = state.conclusion.split('\n\n');

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">

      {/* Header */}
      <p className="text-gold text-xs font-body tracking-widest uppercase mb-6">
        Fine della storia
      </p>

      {/* conclusion.gif */}
      <div className="w-full aspect-[3/2] bg-gold/5 border border-gold/20 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-foreground-muted text-xs font-body">conclusion.gif</span>
      </div>

      {/* Testo conclusione */}
      <div className="flex-1">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={`font-body text-base leading-relaxed mb-4 ${
              p.startsWith('Non preoccuparti') || p.startsWith('—')
                ? 'text-gold'
                : 'text-foreground'
            }`}
          >
            {p}
          </p>
        ))}
      </div>

      <button
        onClick={proceedToContact}
        className="w-full mt-4 bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all"
      >
        Ricevi la tua storia
      </button>

    </div>
  );
}

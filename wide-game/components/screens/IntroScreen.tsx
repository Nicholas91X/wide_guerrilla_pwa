'use client';

import { useGame } from '@/contexts/GameContext';

export default function IntroScreen() {
  const { startGame, loading } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12">

      {/* Header */}
      <div className="text-center">
        <p className="text-gold text-xs font-body tracking-widest uppercase mb-3">
          WIDE Studio Digitale presenta
        </p>
        <h1 className="font-display text-4xl text-foreground leading-tight">
          Imprenditore
          <br />
          per un Giorno
        </h1>
      </div>

      {/* intro.gif */}
      <div className="w-full max-w-xs">
        <div className="w-full aspect-[3/2] bg-gold/5 border border-gold/20 rounded-2xl flex items-center justify-center">
          <span className="text-foreground-muted text-xs font-body">intro.gif</span>
        </div>
      </div>

      {/* Copy + CTA */}
      <div className="w-full max-w-xs text-center">
        <p className="text-foreground-muted text-sm font-body leading-relaxed mb-8">
          Ti assegneremo un prodotto da vendere.
          <br />
          Qualunque scelta tu faccia, andrà male.
          <br />
          Benvenuto nel mondo del business.
        </p>
        <button
          onClick={startGame}
          disabled={loading}
          className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin inline-block" />
              Preparando...
            </span>
          ) : (
            'Inizia'
          )}
        </button>
      </div>

    </div>
  );
}

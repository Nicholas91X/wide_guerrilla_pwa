'use client';

import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import CyclingIcon from '@/components/ui/CyclingIcon';

export default function IntroScreen() {
  const { startGame, loading, error } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12">

      {/* Header */}
      <div className="text-center">
        <p className="text-gold text-xs font-body tracking-widest uppercase mb-3">
          WIDE Studio Digitale ti sfida
        </p>
        <h1 className="font-display text-4xl text-foreground leading-tight">
          Imprenditore
          <br />
          per un Giorno
        </h1>
      </div>

      {/* GIF */}
      <div className="w-full max-w-xs">
        <GifSlot name="intro" />
      </div>

      {/* Copy + CTA */}
      <div className="w-full max-w-xs text-center">
        <p className="text-foreground-muted text-sm font-body leading-relaxed mb-8">
          Tre decisioni di marketing.
          <br />
          Un prodotto che il mercato non sa di volere.
          <br />
          Dimostra di saper vendere.
        </p>
        {error && (
          <p className="text-red-400 text-xs font-body text-center mb-4">{error}</p>
        )}
        <button
          onClick={startGame}
          disabled={loading}
          className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <CyclingIcon />
              Preparando...
            </span>
          ) : (
            'Accetta la sfida'
          )}
        </button>
      </div>

    </div>
  );
}

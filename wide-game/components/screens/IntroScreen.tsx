'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import CyclingIcon from '@/components/ui/CyclingIcon';

export default function IntroScreen() {
  const { startGame, loading, retryCount, error } = useGame();
  const [playerName, setPlayerName] = useState('');

  const canStart = playerName.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12">

      {/* Header */}
      <div className="text-center">
        <p className="text-gold text-[0.55rem] font-body tracking-[0.3em] uppercase mb-4">
          WIDE Studio Digitale presenta
        </p>
        <h1 className="font-display leading-[1.1]">
          <span className="block text-[3rem] text-foreground font-semibold">Imprenditore</span>
          <span className="block text-[2.2rem] text-foreground/70 font-normal italic">per un Giorno</span>
        </h1>
      </div>

      {/* GIF */}
      <div className="w-full max-w-xs my-6">
        <GifSlot name="intro" />
      </div>

      {/* Form */}
      <div className="w-full max-w-xs">
        <p className="text-foreground-muted text-xs font-body leading-relaxed mb-6 text-center">
          Tre decisioni di marketing.
          Un prodotto che il mercato non sa di volere.
          Dimostra di saper vendere.
        </p>

        <div className="mb-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Come ti chiami, imprenditore?"
            disabled={loading}
            className="w-full bg-surface border border-gold/30 text-foreground font-body px-4 py-3.5 rounded-2xl focus:outline-none focus:border-gold/70 focus:bg-surface-elevated placeholder:text-foreground-dim transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-red-400/80 text-xs font-body text-center mb-3">{error}</p>
        )}

        <button
          onClick={() => startGame(playerName.trim())}
          disabled={loading || !canStart}
          className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-sm tracking-wide hover:bg-gold-light active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <CyclingIcon />
              Preparando la sfida…
            </span>
          ) : (
            'Accetta la sfida'
          )}
        </button>

        {loading && retryCount > 1 && (
          <p className="text-foreground-dim text-[0.6rem] font-body text-center mt-3 tracking-wide">
            Nuovo tentativo… ({retryCount} di 4)
          </p>
        )}
      </div>

    </div>
  );
}

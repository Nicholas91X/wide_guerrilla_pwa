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
      <div className="w-full max-w-xs my-8">
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

        {/* Nome giocatore */}
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Come ti chiami, imprenditore?"
          disabled={loading}
          className="w-full bg-transparent border border-gold/45 text-foreground font-body px-4 py-3 rounded-xl mb-6 focus:outline-none focus:border-gold placeholder:text-foreground-muted/50 transition-colors disabled:opacity-50"
        />

        {error && (
          <p className="text-red-400 text-xs font-body text-center mb-4">{error}</p>
        )}
        <button
          onClick={() => startGame(playerName.trim())}
          disabled={loading || !canStart}
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
        {loading && retryCount > 1 && (
          <p className="text-foreground-muted/60 text-xs font-body text-center mt-3">
            Nuovo tentativo... ({retryCount} di 4)
          </p>
        )}
      </div>

    </div>
  );
}

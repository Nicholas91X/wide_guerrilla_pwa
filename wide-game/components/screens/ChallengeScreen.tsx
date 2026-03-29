'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import LoadingState from '@/components/ui/LoadingState';
import GifSlot from '@/components/ui/GifSlot';
import Typewriter from '@/components/ui/Typewriter';

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: 'Il Lancio',
  2: 'La Crisi Operativa',
  3: "L'Ultima Spiaggia",
};

const STEP_GIFS: Record<1 | 2 | 3, string> = {
  1: 'challenge-1',
  2: 'challenge-2',
  3: 'challenge-3',
};

const optionContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const optionItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' as const } },
};

interface Props {
  step: 1 | 2 | 3;
}

export default function ChallengeScreen({ step }: Props) {
  const { state, loading, chooseOption, continueToNext } = useGame();
  if (!state) return null;

  const stepData = state.steps[step - 1];
  const hasChosen = stepData.choice !== null;
  const hasOutput = stepData.output !== null;

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-gold text-xs font-body tracking-widest uppercase">
          Sfida {step} di 3
        </p>
        <p className="text-foreground-muted text-xs font-body">
          {STEP_TITLES[step]}
        </p>
      </div>

      {/* Banner prodotto (solo step 1) */}
      {step === 1 && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 mb-4">
          <p className="text-foreground-muted text-xs font-body uppercase tracking-wide mb-1">
            Il tuo prodotto
          </p>
          <p className="text-foreground text-sm font-body leading-snug">
            {state.product.name}
          </p>
        </div>
      )}

      {/* GIF */}
      <GifSlot name={STEP_GIFS[step]} className="mb-6" />

      {hasChosen ? (
        /* ── Output mode ── */
        <div className="flex-1 flex flex-col justify-between">
          {hasOutput ? (
            <>
              <div>
                <p className="text-gold text-xs font-body uppercase tracking-wide mb-3">
                  Risultato
                </p>
                <p className="text-foreground font-body text-base leading-relaxed">
                  <Typewriter text={stepData.output!} speed={15} />
                </p>
              </div>
              <button
                onClick={continueToNext}
                disabled={loading}
                className="w-full mt-8 bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin inline-block" />
                    Un momento...
                  </span>
                ) : (
                  'Continua'
                )}
              </button>
            </>
          ) : (
            <LoadingState message="Le conseguenze stanno arrivando..." />
          )}
        </div>
      ) : (
        /* ── Choice mode ── */
        <div className="flex-1 flex flex-col">
          {stepData.narrative && (
            <p className="text-foreground-muted font-body text-sm leading-relaxed mb-4 italic">
              {stepData.narrative}
            </p>
          )}
          <p className="text-foreground font-body text-base leading-relaxed mb-6">
            {stepData.challenge}
          </p>
          <motion.div
            className="flex flex-col gap-3"
            variants={optionContainer}
            initial="hidden"
            animate="show"
          >
            {stepData.options.map((option, i) => (
              <motion.button
                key={i}
                variants={optionItem}
                onClick={() => chooseOption(option)}
                disabled={loading}
                className="text-left border border-gold/30 text-foreground font-body text-sm py-3 px-4 rounded-xl hover:border-gold hover:bg-gold/5 active:scale-[0.98] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="text-gold font-semibold mr-2">{i + 1}.</span>
                {option}
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

    </div>
  );
}

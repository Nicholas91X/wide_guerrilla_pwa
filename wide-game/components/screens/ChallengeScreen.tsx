'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import LoadingState from '@/components/ui/LoadingState';
import GifSlot from '@/components/ui/GifSlot';
import CyclingIcon from '@/components/ui/CyclingIcon';
import TypewriterBlock from '@/components/ui/TypewriterBlock';
import ProductImage from '@/components/ui/ProductImage';
import { VIDEO_POOLS } from '@/lib/videoPools';

const STEP_TITLES: Record<1 | 2 | 3, string> = {
  1: 'Il Posizionamento',
  2: 'La Campagna',
  3: 'Il Piano B',
};

// Divide il pitch in frasi: split su punto+spazio, punto+newline, oppure newline nudo
function splitPitch(text: string): string[] {
  const parts = text.split(/\.\s+|\n+/);
  return parts
    .map((p, i) => {
      const t = p.trim();
      if (!t) return null;
      // Riaggiunge il punto rimosso dallo split, solo se non già presente
      return i < parts.length - 1 && !/[.!?]$/.test(t) ? t + '.' : t;
    })
    .filter(Boolean) as string[];
}

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
        <div className="bg-gold/10 border border-gold/30 rounded-xl overflow-hidden mb-4">
          {/* Immagine prodotto */}
          <ProductImage productId={state.product.id} />
          {/* Testo */}
          <div className="px-4 py-3">
            <p className="text-foreground-muted text-xs font-body uppercase tracking-wide mb-1">
              Brief di marketing
            </p>
            <p className="text-foreground text-sm font-body font-semibold leading-snug mb-2">
              {state.product.name}
            </p>
            {state.pitch && splitPitch(state.pitch).map((line, i) => (
              <p key={i} className="text-foreground-muted text-xs font-body leading-snug mt-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Video — random dal pool della sfida corrente */}
      <GifSlot pool={VIDEO_POOLS[`challenge-${step}`]} className="mb-6" />

      {hasChosen ? (
        /* ── Output mode ── */
        <div className="flex-1 flex flex-col justify-between">
          {hasOutput ? (
            <>
              <TypewriterBlock
                text={stepData.output!}
                speed={14}
                hasTitle
              />
              <button
                onClick={continueToNext}
                disabled={loading}
                className="w-full mt-8 bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <CyclingIcon />
                    Un momento...
                  </span>
                ) : (
                  'Continua'
                )}
              </button>
            </>
          ) : (
            <LoadingState />
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
                {option.replace(/^\d+[.)]\s*/, '')}
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import CyclingIcon from '@/components/ui/CyclingIcon';
import TypewriterBlock from '@/components/ui/TypewriterBlock';
import ProductImage from '@/components/ui/ProductImage';
import MarketReaction from '@/components/ui/MarketReaction';
import { VIDEO_POOLS } from '@/lib/videoPools';
import productsData from '@/data/products.json';

const TOTAL_PRODUCTS = productsData.products.length;

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
      return i < parts.length - 1 && !/[.!?]$/.test(t) ? t + '.' : t;
    })
    .filter(Boolean) as string[];
}

const optionContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } },
};

const optionItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

interface Props {
  step: 1 | 2 | 3;
}

// Indicatore step visuale
function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0 justify-center mb-6">
      {([1, 2, 3] as const).map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                s < current
                  ? 'bg-gold/50'
                  : s === current
                  ? 'bg-gold scale-125'
                  : 'bg-foreground-dim'
              }`}
            />
            <span
              className={`text-[0.5rem] font-body tracking-widest uppercase transition-colors duration-300 ${
                s === current ? 'text-gold' : 'text-foreground-dim'
              }`}
            >
              {STEP_TITLES[s].split(' ')[1] ?? STEP_TITLES[s]}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`w-8 h-px mb-4 mx-1 transition-all duration-500 ${
                s < current ? 'bg-gold/40' : 'bg-foreground-dim/40'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ChallengeScreen({ step }: Props) {
  const { state, loading, retryCount, error, chooseOption, continueToNext } = useGame();
  if (!state) return null;

  const stepData = state.steps[step - 1];
  const hasChosen = stepData.choice !== null;
  const hasOutput = stepData.output !== null;

  return (
    <div className="min-h-screen flex flex-col px-5 py-6">

      {/* Step indicator visuale */}
      <StepIndicator current={step} />

      {/* Banner prodotto (solo step 1) */}
      {step === 1 && (
        <div className="bg-surface border border-gold/25 rounded-2xl overflow-hidden mb-5">
          <ProductImage productId={state.product.id} />
          <div className="px-4 py-3.5">
            <p className="text-gold/60 text-[0.55rem] font-body uppercase tracking-[0.2em] mb-1.5">
              Brief di marketing
            </p>
            <p className="text-foreground text-sm font-body font-semibold leading-snug mb-1">
              {state.product.name}
            </p>
            <p className="text-foreground-dim text-[0.55rem] font-body tracking-wide mb-2">
              1 di {TOTAL_PRODUCTS} prodotti impossibili
            </p>
            {state.pitch && splitPitch(state.pitch).map((line, i) => (
              <p key={i} className="text-foreground-muted text-xs font-body leading-relaxed mt-1.5">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Video */}
      <GifSlot pool={VIDEO_POOLS[`challenge-${step}`]} className="mb-5" />

      {hasChosen ? (
        /* ── Output mode ── */
        <div className="flex-1 flex flex-col justify-between">
          {hasOutput ? (
            <>
              <TypewriterBlock
                text={stepData.output!}
                speed={13}
                hasTitle
              />
              <div className="mt-6">
                {error && (
                  <p className="text-red-400/80 text-xs font-body text-center mb-3">{error}</p>
                )}
                {loading && retryCount > 1 && (
                  <p className="text-foreground-dim text-[0.6rem] font-body text-center mb-3 tracking-wide">
                    Nuovo tentativo… ({retryCount} di 4)
                  </p>
                )}
                <button
                  onClick={continueToNext}
                  disabled={loading}
                  className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-sm tracking-wide hover:bg-gold-light active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <CyclingIcon />
                      Un momento…
                    </span>
                  ) : (
                    'Continua'
                  )}
                </button>
              </div>
            </>
          ) : (
            /* ── Overlay di transizione ── */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm flex flex-col items-center px-5"
            >
              {/* GIF libera in alto */}
              <div className="mt-16 w-full max-w-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gifs/loading.gif"
                  alt="Caricamento..."
                  className="w-full rounded-xl"
                />
              </div>

              <span className="gold-rule mt-4 mb-2" />
              <p className="text-foreground-muted text-xs font-body text-center mb-8">
                Stiamo contabilizzando i danni…
              </p>

              {/* Market Reaction centrata */}
              <div className="w-full max-w-sm">
                <MarketReaction step={step} />
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* ── Choice mode ── */
        <div className="flex-1 flex flex-col">
          {stepData.narrative && (
            <p className="text-foreground-muted font-body text-xs leading-relaxed mb-3 italic">
              {stepData.narrative}
            </p>
          )}

          <p className="text-foreground font-body text-sm leading-relaxed mb-5">
            {stepData.challenge}
          </p>

          <motion.div
            className="flex flex-col gap-2.5"
            variants={optionContainer}
            initial="hidden"
            animate="show"
          >
            {stepData.options.map((option, i) => {
              const isBonus = step === 3 && i === stepData.options.length - 1;
              return (
                <motion.button
                  key={i}
                  variants={optionItem}
                  onClick={() => chooseOption(option)}
                  disabled={loading}
                  className={
                    isBonus
                      ? 'group text-left bg-gold/10 border-2 border-gold/60 text-foreground font-body text-xs py-3.5 px-4 rounded-2xl hover:bg-gold/18 hover:border-gold active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
                      : 'group text-left bg-surface border border-gold/20 text-foreground font-body text-xs py-3.5 px-4 rounded-2xl hover:border-gold/50 hover:bg-surface-elevated active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
                  }
                >
                  {isBonus && (
                    <span className="flex items-center gap-1.5 text-gold text-[0.5rem] font-body font-semibold uppercase tracking-widest mb-1.5">
                      <span>✦</span>
                      Asso nella manica
                    </span>
                  )}
                  <span className="flex items-start gap-2.5">
                    <span className="text-gold font-semibold shrink-0 tabular-nums">{i + 1}.</span>
                    <span className="leading-relaxed">{option.replace(/^\d+[.)]\s*/, '')}</span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {loading && retryCount > 1 && (
            <p className="text-foreground-dim text-[0.6rem] font-body text-center mt-4 tracking-wide">
              Nuovo tentativo… ({retryCount} di 4)
            </p>
          )}
          {error && !loading && (
            <p className="text-red-400/80 text-xs font-body text-center mt-4">{error}</p>
          )}
        </div>
      )}

    </div>
  );
}

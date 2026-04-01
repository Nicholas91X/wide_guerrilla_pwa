'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import { VIDEO_POOLS } from '@/lib/videoPools';
import TypewriterBlock from '@/components/ui/TypewriterBlock';

// Separa il narrativo dalla firma WIDE ("Non preoccuparti — ...")
function splitConclusion(text: string): { narrative: string; signature: string | null } {
  const marker = 'Non preoccuparti';
  const idx = text.indexOf(marker);
  if (idx === -1) return { narrative: text.trim(), signature: null };
  return {
    narrative: text.slice(0, idx).trim(),
    signature: text.slice(idx).trim(),
  };
}

export default function ConclusionScreen() {
  const { state, proceedToContact } = useGame();
  const [done, setDone] = useState(false);

  // useCallback: referenza stabile → non causa reset del typewriter
  const handleDone = useCallback(() => setDone(true), []);

  if (!state || !state.conclusion) return null;

  const { narrative, signature } = splitConclusion(state.conclusion);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">

      <p className="text-gold text-xs font-body tracking-widest uppercase mb-6">
        Fine della storia
      </p>

      <GifSlot pool={VIDEO_POOLS.conclusion} className="mb-6" />

      <div className="flex-1">
        <TypewriterBlock
          text={narrative}
          speed={13}
          hasTitle={false}
          onDone={handleDone}
        />

        {/* Firma WIDE — card oro, appare dopo il typewriter */}
        {signature && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.2 }}
            className="mt-6 bg-gold/20 border border-gold/50 rounded-2xl px-5 py-4"
          >
            {signature.split('\n').filter(Boolean).map((line, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-foreground font-body text-sm leading-relaxed'
                    : 'text-gold font-display text-base mt-2'
                }
              >
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.9 }}
        className="text-foreground-muted/40 text-xs font-body text-center mt-6"
      >
        Storia diversa ogni volta. Generata dall&apos;AI. Rovinata da te.
      </motion.p>

      <motion.button
        onClick={proceedToContact}
        initial={{ opacity: 0, y: 10 }}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const, delay: 1.1 }}
        className="w-full mt-4 bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all"
      >
        Ricevi la tua storia
      </motion.button>

    </div>
  );
}

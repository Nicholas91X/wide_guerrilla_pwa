'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import { VIDEO_POOLS } from '@/lib/videoPools';
import TypewriterBlock from '@/components/ui/TypewriterBlock';

export default function ConclusionScreen() {
  const { state, proceedToContact } = useGame();
  const [done, setDone] = useState(false);

  const handleDone = useCallback(() => setDone(true), []);

  if (!state || !state.conclusion) return null;

  return (
    <div className="min-h-screen flex flex-col px-5 py-8">

      {/* Header */}
      <div className="mb-6">
        <p className="text-gold/60 text-[0.55rem] font-body tracking-[0.3em] uppercase mb-1">
          Capitolo finale
        </p>
        <h2 className="font-display text-[1.9rem] text-foreground font-semibold leading-tight italic">
          Fine della storia
        </h2>
      </div>

      <GifSlot pool={VIDEO_POOLS.conclusion} className="mb-6" />

      <div className="flex-1">
        {/* Conclusione narrata */}
        <TypewriterBlock
          text={state.conclusion}
          speed={13}
          hasTitle={false}
          onDone={handleDone}
        />

        {/* Bridge */}
        {state.conclusionBridge && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.2 }}
            className="mt-5 text-foreground-muted text-xs font-body leading-relaxed italic"
          >
            {state.conclusionBridge}
          </motion.p>
        )}

        {/* Card WIDE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.55 }}
          className="mt-5 bg-surface border border-gold/30 rounded-2xl px-5 py-4"
        >
          <span className="gold-rule mb-3" />
          <p className="text-foreground/80 font-body text-xs leading-relaxed">
            Non ti preoccupare — alle sfide del marketing ci pensiamo noi.
          </p>
          <p className="text-gold font-display text-sm italic mt-2">
            WIDE Studio Digitale
          </p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.9 }}
        className="text-foreground-dim text-[0.55rem] font-body text-center mt-5 tracking-widest uppercase"
      >
        Storia diversa ogni volta · Generata dall&apos;AI · Rovinata da te
      </motion.p>

      <motion.button
        onClick={proceedToContact}
        initial={{ opacity: 0, y: 8 }}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const, delay: 1.1 }}
        className="w-full mt-4 bg-gold text-background font-body font-semibold py-4 rounded-full text-sm tracking-wide hover:bg-gold-light active:scale-[0.98] transition-all duration-200"
      >
        Ricevi la tua storia
      </motion.button>

    </div>
  );
}

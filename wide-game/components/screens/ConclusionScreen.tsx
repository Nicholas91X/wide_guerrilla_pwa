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
    <div className="min-h-screen flex flex-col px-6 py-8">

      <p className="text-gold text-xs font-body tracking-widest uppercase mb-6">
        Fine della storia
      </p>

      <GifSlot pool={VIDEO_POOLS.conclusion} className="mb-6" />

      <div className="flex-1">
        {/* BLOCCO 1 — Bancarotta */}
        <TypewriterBlock
          text={state.conclusion}
          speed={13}
          hasTitle={false}
          onDone={handleDone}
        />

        {/* BLOCCO 2 — Il Ponte (testo asciutto, nessun riferimento WIDE) */}
        {state.conclusionBridge && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.2 }}
            className="mt-6 text-foreground-muted text-sm font-body leading-relaxed italic"
          >
            {state.conclusionBridge}
          </motion.p>
        )}

        {/* Card WIDE — hardcodata, appare dopo il bridge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.7, ease: 'easeOut' as const, delay: 0.55 }}
          className="mt-4 bg-gold/20 border border-gold/50 rounded-2xl px-5 py-4"
        >
          <p className="text-foreground font-body text-sm leading-relaxed">
            Non ti preoccupare — alle sfide del marketing ci pensiamo noi.
          </p>
          <p className="text-gold font-display text-base mt-2">
            WIDE Studio Digitale
          </p>
        </motion.div>
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

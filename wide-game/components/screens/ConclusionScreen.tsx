'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import TypewriterBlock from '@/components/ui/TypewriterBlock';

export default function ConclusionScreen() {
  const { state, proceedToContact } = useGame();
  const [done, setDone] = useState(false);

  if (!state || !state.conclusion) return null;

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">

      <p className="text-gold text-xs font-body tracking-widest uppercase mb-6">
        Fine della storia
      </p>

      <GifSlot name="conclusion" className="mb-6" />

      <div className="flex-1">
        <TypewriterBlock
          text={state.conclusion}
          speed={13}
          hasTitle={false}
          onDone={() => setDone(true)}
        />
      </div>

      <motion.button
        onClick={proceedToContact}
        initial={{ opacity: 0, y: 10 }}
        animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="w-full mt-4 bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all"
      >
        Ricevi la tua storia
      </motion.button>

    </div>
  );
}

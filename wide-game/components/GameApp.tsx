'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from '@/contexts/GameContext';
import PreIntroScreen from './screens/PreIntroScreen';
import IntroScreen from './screens/IntroScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ConclusionScreen from './screens/ConclusionScreen';
import ContactScreen from './screens/ContactScreen';

function GameContent() {
  const { state } = useGame();
  const [preIntroDone, setPreIntroDone] = useState(false);

  const key = !preIntroDone ? 'preintro' : state ? String(state.currentStep) : 'intro';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [key]);

  let screen: React.ReactNode;
  if (!preIntroDone) screen = <PreIntroScreen onReady={() => setPreIntroDone(true)} />;
  else if (!state) screen = <IntroScreen />;
  else if (state.currentStep === 1) screen = <ChallengeScreen step={1} />;
  else if (state.currentStep === 2) screen = <ChallengeScreen step={2} />;
  else if (state.currentStep === 3) screen = <ChallengeScreen step={3} />;
  else if (state.currentStep === 'conclusion') screen = <ConclusionScreen />;
  else if (state.currentStep === 'contact') screen = <ContactScreen />;
  else screen = null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {screen}
        <footer className="flex flex-col items-center gap-2 py-8 px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="WIDE Studio Digitale" width={32} height={32} className="opacity-40" />
          <p className="text-foreground-muted/40 text-xs font-body text-center leading-relaxed">
            Un&rsquo;esperienza tragicomica offerta da WIDE Studio Digitale.
          </p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}

export default function GameApp() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

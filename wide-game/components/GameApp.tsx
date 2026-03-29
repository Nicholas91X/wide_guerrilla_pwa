'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from '@/contexts/GameContext';
import IntroScreen from './screens/IntroScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ConclusionScreen from './screens/ConclusionScreen';
import ContactScreen from './screens/ContactScreen';

function GameContent() {
  const { state } = useGame();

  const key = state ? String(state.currentStep) : 'intro';

  let screen: React.ReactNode;
  if (!state) screen = <IntroScreen />;
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

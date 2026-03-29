'use client';

import { GameProvider, useGame } from '@/contexts/GameContext';
import IntroScreen from './screens/IntroScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ConclusionScreen from './screens/ConclusionScreen';
import ContactScreen from './screens/ContactScreen';

function GameContent() {
  const { state } = useGame();

  if (!state) return <IntroScreen />;
  if (state.currentStep === 1) return <ChallengeScreen step={1} />;
  if (state.currentStep === 2) return <ChallengeScreen step={2} />;
  if (state.currentStep === 3) return <ChallengeScreen step={3} />;
  if (state.currentStep === 'conclusion') return <ConclusionScreen />;
  if (state.currentStep === 'contact') return <ContactScreen />;
  return null;
}

export default function GameApp() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

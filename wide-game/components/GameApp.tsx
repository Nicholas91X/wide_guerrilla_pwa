'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from '@/contexts/GameContext';
import PreIntroScreen from './screens/PreIntroScreen';
import IntroScreen from './screens/IntroScreen';
import ChallengeScreen from './screens/ChallengeScreen';
import ConclusionScreen from './screens/ConclusionScreen';
import ContactScreen from './screens/ContactScreen';
import BudgetBar from './ui/BudgetBar';
import { reopenCookieBanner } from './ui/CookieBanner';

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

  const showBudget = state && typeof state.currentStep === 'number';

  return (
    <>
      {showBudget && <BudgetBar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {screen}
          {key !== 'preintro' && (
            <footer className="flex flex-col items-center gap-2 py-10 px-6">
              <span className="gold-rule mb-1" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="WIDE Studio Digitale"
                width={28}
                height={28}
                className="opacity-30 rounded-full mt-1"
              />
              <p className="text-foreground-dim text-[0.6rem] font-body text-center tracking-widest uppercase mt-1">
                WIDE Studio Digitale
              </p>
              <div className="flex items-center gap-3 mt-2">
                <a
                  href="https://widestudiodigitale.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-dim text-[0.5rem] font-body tracking-wide hover:text-foreground-muted transition-colors"
                >
                  Privacy
                </a>
                <span className="text-foreground-dim/40 text-[0.5rem]">·</span>
                <button
                  type="button"
                  onClick={() => reopenCookieBanner()}
                  className="text-foreground-dim text-[0.5rem] font-body tracking-wide hover:text-foreground-muted transition-colors"
                >
                  Gestisci cookie
                </button>
              </div>
            </footer>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function GameApp() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

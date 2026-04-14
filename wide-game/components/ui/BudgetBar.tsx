'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, INITIAL_BUDGET } from '@/contexts/GameContext';

function formatBudget(n: number): string {
  const abs = Math.abs(n).toLocaleString('it-IT');
  return n < 0 ? `-€${abs}` : `€${abs}`;
}

export default function BudgetBar() {
  const { state, currentBudget } = useGame();
  const [displayed, setDisplayed] = useState(INITIAL_BUDGET);
  const prevRef = useRef(INITIAL_BUDGET);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const start = prevRef.current;
    const end = currentBudget;
    if (start === end) return;

    // Trigger shake quando il budget va sotto zero
    if (end < 0 && start >= 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }

    const duration = 1000;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        prevRef.current = end;
      }
    };

    requestAnimationFrame(frame);
  }, [currentBudget]);

  const isNegative = displayed < 0;
  const ratio = Math.max(0, displayed / INITIAL_BUDGET);

  const amountColor = isNegative
    ? 'text-red-500'
    : displayed > 5000
    ? 'text-emerald-400'
    : displayed > 1000
    ? 'text-yellow-400'
    : 'text-red-400';

  const barColor =
    displayed > 5000
      ? 'bg-emerald-400'
      : displayed > 1000
      ? 'bg-yellow-400'
      : 'bg-red-400';

  const expenses = (state?.steps ?? [])
    .filter((s) => s.spent !== null && s.spentLabel !== null)
    .map((s) => ({ label: s.spentLabel!, amount: s.spent! }));

  return (
    <div
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b transition-colors duration-500 ${
        isNegative ? 'border-red-500/30' : 'border-gold/15'
      }`}
      style={shaking ? { animation: 'budget-shake 0.6s ease-out' } : undefined}
    >
      {/* Riga principale */}
      <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5">
        <span className="text-foreground-dim text-[0.5rem] font-body tracking-[0.25em] uppercase">
          Budget
        </span>
        <div className="flex items-center gap-2">
          {isNegative && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.6, 1, 0.6], scale: 1 }}
              transition={{ opacity: { duration: 1.5, repeat: Infinity }, scale: { duration: 0.3 } }}
              className="text-red-500 text-[0.45rem] font-body font-bold tracking-[0.2em] uppercase"
            >
              IN ROSSO
            </motion.span>
          )}
          <span className={`font-body font-semibold text-sm tabular-nums transition-colors duration-500 ${amountColor}`}>
            {formatBudget(displayed)}
          </span>
        </div>
      </div>

      {/* Progress bar sottile */}
      <div className="mx-5 mb-1.5 h-px bg-foreground-dim/20 rounded-full overflow-hidden">
        {isNegative ? (
          <motion.div
            className="h-full rounded-full bg-red-500"
            animate={{ width: ['100%', '60%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          />
        )}
      </div>

      {/* Spese accumulate */}
      <AnimatePresence initial={false}>
        {expenses.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-center justify-between px-5 pb-1.5"
          >
            <span className="text-foreground-dim text-[0.55rem] font-body truncate pr-4 tracking-wide">
              {e.label}
            </span>
            <span className="text-red-400/70 text-[0.55rem] font-body tabular-nums shrink-0">
              −{e.amount}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

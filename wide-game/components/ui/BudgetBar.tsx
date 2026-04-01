'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, INITIAL_BUDGET, parseSpent } from '@/contexts/GameContext';

function formatBudget(n: number): string {
  const abs = Math.abs(n).toLocaleString('it-IT');
  return n < 0 ? `-€${abs}` : `€${abs}`;
}

export default function BudgetBar() {
  const { state, currentBudget } = useGame();
  const [displayed, setDisplayed] = useState(INITIAL_BUDGET);
  const prevRef = useRef(INITIAL_BUDGET);

  useEffect(() => {
    const start = prevRef.current;
    const end = currentBudget;
    if (start === end) return;

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

  const balanceColor =
    displayed > 5000
      ? 'text-emerald-400'
      : displayed > 1000
      ? 'text-yellow-400'
      : 'text-red-400';

  // Voci di spesa accumulate dagli step completati
  const expenses = (state?.steps ?? [])
    .filter((s) => s.spent !== null && s.spentLabel !== null)
    .map((s) => ({ label: s.spentLabel!, amount: s.spent! }));

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-gold/20">
      {/* Riga principale: Budget + saldo */}
      <div className="flex items-center justify-between px-6 py-2.5">
        <span className="text-foreground-muted/60 text-xs font-body tracking-widest uppercase">
          Budget
        </span>
        <span className={`font-body font-semibold text-sm tabular-nums transition-colors duration-500 ${balanceColor}`}>
          {formatBudget(displayed)}
        </span>
      </div>

      {/* Log delle spese — appare man mano */}
      <AnimatePresence initial={false}>
        {expenses.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-between px-6 pb-2"
          >
            <span className="text-foreground-muted/50 text-[11px] font-body truncate pr-4">
              {e.label}
            </span>
            <span className="text-red-400/80 text-[11px] font-body tabular-nums shrink-0">
              -{e.amount}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

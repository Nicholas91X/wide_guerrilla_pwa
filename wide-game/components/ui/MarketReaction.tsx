'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
  step: 1 | 2 | 3;
}

interface Metric {
  label: string;
  peak: number;
  crash: number;
  suffix: string;
}

function generateMetrics(step: number): Metric[] {
  // Numeri alti e convincenti che poi crollano a quasi zero
  const multiplier = 1 + step * 0.4;
  return [
    {
      label: 'Clienti raggiunti',
      peak: Math.floor((800 + Math.random() * 600) * multiplier),
      crash: Math.floor(Math.random() * 4) + 1,
      suffix: '',
    },
    {
      label: 'Menzioni social',
      peak: Math.floor((300 + Math.random() * 250) * multiplier),
      crash: Math.floor(Math.random() * 2) + 1,
      suffix: '',
    },
    {
      label: 'Interesse Google',
      peak: Math.floor(Math.random() * 15) + 82,
      crash: Math.floor(Math.random() * 3) + 1,
      suffix: '%',
    },
  ];
}

function useAnimatedNumber(target: number, duration: number, delay: number): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();

      const frame = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic per salita fluida
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(frame);
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

function MetricPill({ metric, index, crashed }: { metric: Metric; index: number; crashed: boolean }) {
  const currentTarget = crashed ? metric.crash : metric.peak;
  const displayed = useAnimatedNumber(currentTarget, crashed ? 400 : 1800, crashed ? 0 : 300 + index * 250);

  const color = crashed
    ? 'border-red-500/40 bg-red-500/8'
    : 'border-emerald-400/35 bg-emerald-400/8';

  const valueColor = crashed ? 'text-red-400' : 'text-emerald-400';
  const arrow = crashed ? '↓' : '↑';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.12 }}
      className={`flex items-center justify-between border rounded-xl px-4 py-2.5 transition-colors duration-700 ${color}`}
    >
      <span className="text-foreground/70 text-[0.65rem] font-body tracking-wide">
        {metric.label}
      </span>
      <span className={`text-xs font-body font-bold tabular-nums transition-colors duration-700 ${valueColor}`}>
        {arrow} {displayed.toLocaleString('it-IT')}{metric.suffix}
      </span>
    </motion.div>
  );
}

export default function MarketReaction({ step }: Props) {
  const [metrics] = useState(() => generateMetrics(step));
  const [crashed, setCrashed] = useState(false);

  const triggerCrash = useCallback(() => setCrashed(true), []);

  useEffect(() => {
    // I numeri salgono per ~3.5s, poi crollano tutti insieme
    const timer = setTimeout(triggerCrash, 3500);
    return () => clearTimeout(timer);
  }, [triggerCrash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-col gap-2"
    >
      <p className="text-foreground/50 text-[0.6rem] font-body tracking-[0.25em] uppercase mb-0.5">
        Reazione del mercato
      </p>
      {metrics.map((m, i) => (
        <MetricPill key={m.label} metric={m} index={i} crashed={crashed} />
      ))}
      {crashed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-red-400/60 text-[0.55rem] font-body text-center mt-1 tracking-wide"
        >
          Il mercato ha risposto.
        </motion.p>
      )}
    </motion.div>
  );
}

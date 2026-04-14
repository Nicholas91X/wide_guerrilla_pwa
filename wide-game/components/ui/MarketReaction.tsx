'use client';

import { useEffect, useState, useRef } from 'react';
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
  const base = step * 120 + Math.floor(Math.random() * 80);
  return [
    {
      label: 'Clienti raggiunti',
      peak: base + Math.floor(Math.random() * 200),
      crash: Math.floor(Math.random() * 8) + 2,
      suffix: '',
    },
    {
      label: 'Menzioni social',
      peak: Math.floor(base * 0.6) + Math.floor(Math.random() * 50),
      crash: Math.floor(Math.random() * 3) + 1,
      suffix: '',
    },
    {
      label: 'Interesse Google',
      peak: Math.floor(Math.random() * 40) + 55,
      crash: Math.floor(Math.random() * 5) + 1,
      suffix: '%',
    },
  ];
}

function useAnimatedNumber(target: number, duration: number, delay: number): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const from = 0;

      const frame = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(from + (target - from) * eased));
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

function MetricPill({ metric, index }: { metric: Metric; index: number }) {
  const [crashed, setCrashed] = useState(false);
  const currentTarget = crashed ? metric.crash : metric.peak;
  const displayed = useAnimatedNumber(currentTarget, crashed ? 600 : 1200, crashed ? 0 : index * 200);

  useEffect(() => {
    const timer = setTimeout(() => setCrashed(true), 1800 + index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const color = crashed
    ? 'text-red-400 border-red-400/30 bg-red-400/5'
    : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex items-center justify-between border rounded-xl px-3 py-2 transition-colors duration-500 ${color}`}
    >
      <span className="text-foreground-dim text-[0.55rem] font-body tracking-wide">
        {metric.label}
      </span>
      <span className={`text-xs font-body font-semibold tabular-nums transition-colors duration-500 ${crashed ? 'text-red-400' : 'text-emerald-400'}`}>
        {crashed ? '↓ ' : '↑ '}
        {displayed.toLocaleString('it-IT')}{metric.suffix}
      </span>
    </motion.div>
  );
}

export default function MarketReaction({ step }: Props) {
  const [metrics] = useState(() => generateMetrics(step));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="mt-4 flex flex-col gap-1.5"
    >
      <p className="text-foreground-dim text-[0.5rem] font-body tracking-[0.25em] uppercase mb-1">
        Reazione del mercato
      </p>
      {metrics.map((m, i) => (
        <MetricPill key={m.label} metric={m} index={i} />
      ))}
    </motion.div>
  );
}

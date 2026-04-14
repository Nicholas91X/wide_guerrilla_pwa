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

// Durata totale dell'animazione (~7s di fluttuazioni + stabilizzazione finale)
const TOTAL_DURATION = 7000;

function generateMetrics(step: number): Metric[] {
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

/**
 * Genera una sequenza di keyframe che oscilla tra valori positivi e negativi,
 * poi si stabilizza sul valore finale (crash).
 *
 * Struttura: salita iniziale → 3-4 oscillazioni (picco/calo/picco/calo) → crollo finale
 */
function generateKeyframes(peak: number, crash: number): { value: number; time: number }[] {
  const frames: { value: number; time: number }[] = [];

  // Salita iniziale
  frames.push({ value: 0, time: 0 });
  frames.push({ value: Math.floor(peak * 0.7), time: 0.12 });
  frames.push({ value: peak, time: 0.22 });

  // Oscillazioni: cala, risale, cala più, risale meno — trend negativo
  frames.push({ value: Math.floor(peak * 0.35), time: 0.33 });
  frames.push({ value: Math.floor(peak * 0.75), time: 0.44 });
  frames.push({ value: Math.floor(peak * 0.15), time: 0.56 });
  frames.push({ value: Math.floor(peak * 0.55), time: 0.66 });
  frames.push({ value: Math.floor(peak * 0.08), time: 0.78 });
  frames.push({ value: Math.floor(peak * 0.3), time: 0.86 });

  // Crollo finale e stabilizzazione
  frames.push({ value: crash, time: 0.94 });
  frames.push({ value: crash, time: 1.0 });

  return frames;
}

function interpolateKeyframes(
  keyframes: { value: number; time: number }[],
  progress: number
): number {
  if (progress <= 0) return keyframes[0].value;
  if (progress >= 1) return keyframes[keyframes.length - 1].value;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const curr = keyframes[i];
    const next = keyframes[i + 1];
    if (progress >= curr.time && progress <= next.time) {
      const segmentProgress = (progress - curr.time) / (next.time - curr.time);
      // Ease in-out per transizioni fluide tra keyframe
      const eased = segmentProgress < 0.5
        ? 2 * segmentProgress * segmentProgress
        : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;
      return Math.round(curr.value + (next.value - curr.value) * eased);
    }
  }
  return keyframes[keyframes.length - 1].value;
}

function MetricPill({ metric, index }: { metric: Metric; index: number }) {
  const [displayed, setDisplayed] = useState(0);
  const [keyframes] = useState(() => generateKeyframes(metric.peak, metric.crash));
  const rafRef = useRef(0);
  const settled = displayed === metric.crash && displayed < metric.peak * 0.1;

  useEffect(() => {
    const delay = 200 + index * 150;
    const timeout = setTimeout(() => {
      const start = performance.now();

      const frame = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / TOTAL_DURATION, 1);
        setDisplayed(interpolateKeyframes(keyframes, progress));
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
  }, [keyframes, index]);

  const isPositive = displayed > metric.peak * 0.25;
  const color = settled
    ? 'border-red-500/40 bg-red-500/8'
    : isPositive
    ? 'border-emerald-400/35 bg-emerald-400/8'
    : 'border-red-500/30 bg-red-500/5';

  const valueColor = settled
    ? 'text-red-400'
    : isPositive
    ? 'text-emerald-400'
    : 'text-red-400';

  const arrow = isPositive ? '↑' : '↓';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.12 }}
      className={`flex items-center justify-between border rounded-xl px-4 py-2.5 transition-colors duration-300 ${color}`}
    >
      <span className="text-foreground/70 text-[0.65rem] font-body tracking-wide">
        {metric.label}
      </span>
      <span className={`text-xs font-body font-bold tabular-nums transition-colors duration-300 ${valueColor}`}>
        {arrow} {displayed.toLocaleString('it-IT')}{metric.suffix}
      </span>
    </motion.div>
  );
}

export default function MarketReaction({ step }: Props) {
  const [metrics] = useState(() => generateMetrics(step));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), TOTAL_DURATION + 400);
    return () => clearTimeout(timer);
  }, []);

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
        <MetricPill key={m.label} metric={m} index={i} />
      ))}
      {settled && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-400/60 text-[0.55rem] font-body text-center mt-1 tracking-wide"
        >
          Il mercato ha risposto.
        </motion.p>
      )}
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';

const ICONS = ['💸', '📉', '💼', '😱', '🔥', '🤌'];

export default function CyclingIcon() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ICONS.length), 150);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-block w-5 text-center" aria-hidden="true">
      {ICONS[i]}
    </span>
  );
}

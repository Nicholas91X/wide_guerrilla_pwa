'use client';

import { useState } from 'react';

interface Props {
  productId: number;
}

export default function ProductImage({ productId }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-full h-[180px] bg-gold/12 border-b border-gold/35 flex items-center justify-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold/50"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/products/${productId}.png`}
      alt=""
      onError={() => setErrored(true)}
      className="w-full h-[180px] object-cover"
    />
  );
}

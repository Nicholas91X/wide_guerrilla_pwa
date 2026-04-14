'use client';

import { useEffect, useState } from 'react';

interface GameStats {
  totalGames: number;
  loading: boolean;
}

export function useGameStats(): GameStats {
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data: { totalGames: number }) => setTotalGames(data.totalGames))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { totalGames, loading };
}

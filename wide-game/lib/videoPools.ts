/**
 * Pool di video per ogni slot del gioco.
 * GifSlot pesca un file a caso dal pool al mount del componente.
 *
 * Da rifinire dopo aver visionato i video:
 * spostare i file nelle categorie più appropriate.
 */

const ALL = ['gif_1', 'gif_2', 'gif_3', 'gif_4', 'gif_5', 'gif_6', 'gif_7', 'gif_8'] as const;

export const VIDEO_POOLS = {
  // Sfida 1 — pool dedicata
  'challenge-1': ['posizionamento_1', 'posizionamento_2'] as const,
  'challenge-2': ALL,
  'challenge-3': ALL,

  // Fine storia e reveal WIDE — stessa pool per ora
  conclusion: ALL,
  reveal:     ALL,
} as const satisfies Record<string, readonly string[]>;

export type PoolKey = keyof typeof VIDEO_POOLS;

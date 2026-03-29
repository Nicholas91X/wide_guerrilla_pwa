import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Imprenditore per un Giorno',
    short_name: 'WIDE Game',
    description: 'Riesci a sopravvivere un giorno nel mondo del business?',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0d0d',
    theme_color: '#c9963a',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

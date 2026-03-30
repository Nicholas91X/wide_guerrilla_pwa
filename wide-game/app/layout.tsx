import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const BASE_URL = 'https://game.widestudiodigitale.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Imprenditore per un Giorno',
  description: 'Ti diamo un prodotto impossibile e tre decisioni strategiche da prendere. Nel mercato italiano.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WIDE Game',
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'WIDE Studio Digitale',
    title: 'Imprenditore per un Giorno',
    description: 'Ti diamo un prodotto impossibile e tre decisioni strategiche da prendere. Nel mercato italiano.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Imprenditore per un Giorno — WIDE Studio Digitale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imprenditore per un Giorno',
    description: 'Ti diamo un prodotto impossibile e tre decisioni strategiche da prendere. Nel mercato italiano.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#C9963A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="it"
      className={`${playfairDisplay.variable} ${outfit.variable}`}
    >
      <body className="bg-background text-foreground font-body antialiased min-h-screen">
        {children}
      </body>
      {gaId && gaId !== 'placeholder' && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}

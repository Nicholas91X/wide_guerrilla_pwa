import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
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
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body className="bg-background text-foreground font-body antialiased min-h-screen">
        {children}
      </body>
      {gaId && gaId !== 'placeholder' && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}

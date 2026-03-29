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

export const metadata: Metadata = {
  title: 'Imprenditore per un Giorno',
  description: 'Riesci a sopravvivere un giorno nel mondo del business?',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WIDE Game',
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

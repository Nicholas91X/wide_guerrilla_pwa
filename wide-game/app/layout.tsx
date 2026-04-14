import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Script from 'next/script';
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="it"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      {gtmId && gtmId !== 'placeholder' && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      )}
      <body className="bg-background text-foreground font-body antialiased min-h-screen">
        {gtmId && gtmId !== 'placeholder' && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}

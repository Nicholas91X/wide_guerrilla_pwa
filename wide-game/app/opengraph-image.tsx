import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Imprenditore per un Giorno — WIDE Studio Digitale';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0d0d0d',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Bordo oro top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#c9963a' }} />

        {/* Label WIDE */}
        <div style={{
          color: '#c9963a',
          fontSize: 14,
          letterSpacing: 6,
          textTransform: 'uppercase',
          marginBottom: 32,
          fontFamily: 'system-ui, sans-serif',
        }}>
          WIDE Studio Digitale presenta
        </div>

        {/* Titolo principale */}
        <div style={{
          color: '#f5f0e8',
          fontSize: 80,
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: 'center',
          marginBottom: 28,
        }}>
          Imprenditore
          <br />
          per un Giorno
        </div>

        {/* Tagline */}
        <div style={{
          color: '#a09888',
          fontSize: 24,
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.5,
        }}>
          Ti diamo un prodotto impossibile e tre decisioni strategiche.
          <br />
          Nel mercato italiano.
        </div>

        {/* URL in basso */}
        <div style={{
          position: 'absolute',
          bottom: 36,
          color: '#c9963a',
          fontSize: 16,
          letterSpacing: 2,
          fontFamily: 'system-ui, sans-serif',
        }}>
          game.widestudiodigitale.com
        </div>

        {/* Bordo oro bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#c9963a' }} />
      </div>
    ),
    { ...size }
  );
}

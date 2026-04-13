'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

interface Props {
  playerName: string;
  productName: string;
  totalLoss: string;
  lastWords: string;
}

function todayItalian(): string {
  return new Date().toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BankruptcyCertificate({
  playerName,
  productName,
  totalLoss,
  lastWords,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  async function handleShare() {
    if (!ref.current || sharing) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'certificato-bancarotta.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Il mio certificato di bancarotta',
        });
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'certificato-bancarotta.png';
        a.click();
      }
    } catch (err) {
      console.error('[BankruptcyCertificate] share error', err);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      {/* Certificato — renderizzato come immagine */}
      <div
        ref={ref}
        style={{
          backgroundColor: '#080806',
          border: '1px solid rgba(201,150,58,0.5)',
          borderRadius: '16px',
          padding: '32px 28px',
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorazione angoli */}
        <div style={{
          position: 'absolute', top: 10, left: 10, width: 18, height: 18,
          borderTop: '1px solid rgba(201,150,58,0.35)', borderLeft: '1px solid rgba(201,150,58,0.35)',
        }} />
        <div style={{
          position: 'absolute', top: 10, right: 10, width: 18, height: 18,
          borderTop: '1px solid rgba(201,150,58,0.35)', borderRight: '1px solid rgba(201,150,58,0.35)',
        }} />
        <div style={{
          position: 'absolute', bottom: 10, left: 10, width: 18, height: 18,
          borderBottom: '1px solid rgba(201,150,58,0.35)', borderLeft: '1px solid rgba(201,150,58,0.35)',
        }} />
        <div style={{
          position: 'absolute', bottom: 10, right: 10, width: 18, height: 18,
          borderBottom: '1px solid rgba(201,150,58,0.35)', borderRight: '1px solid rgba(201,150,58,0.35)',
        }} />

        {/* Intestazione */}
        <p style={{ color: 'rgba(201,150,58,0.45)', fontSize: '0.5rem', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 2 }}>
          Repubblica Italiana
        </p>
        <p style={{ color: 'rgba(201,150,58,0.4)', fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20 }}>
          Tribunale Fallimentare Straordinario
        </p>

        {/* Linea oro */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,150,58,0.4), transparent)', marginBottom: 20 }} />

        {/* Titolo */}
        <h3 style={{ color: '#f0ebe1', fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 600, marginBottom: 4, letterSpacing: '-0.01em' }}>
          Certificato
        </h3>
        <p style={{ color: '#c9963a', fontSize: '0.52rem', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 20 }}>
          di Bancarotta Conclamata
        </p>

        {/* Corpo */}
        <p style={{ color: 'rgba(240,235,225,0.45)', fontSize: '0.6rem', marginBottom: 6, letterSpacing: '0.05em' }}>
          Si certifica con piena contumacia che
        </p>
        <p style={{ color: '#f0ebe1', fontSize: '1.2rem', fontWeight: 700, marginBottom: 6, letterSpacing: '0.02em' }}>
          {playerName}
        </p>
        <p style={{ color: 'rgba(240,235,225,0.45)', fontSize: '0.6rem', marginBottom: 8, letterSpacing: '0.05em' }}>
          ha condotto al definitivo fallimento il lancio di
        </p>
        <p style={{ color: '#c9963a', fontSize: '0.72rem', fontStyle: 'italic', marginBottom: 20, letterSpacing: '0.02em' }}>
          &ldquo;{productName}&rdquo;
        </p>

        {/* Perdita */}
        <div style={{ background: 'rgba(201,150,58,0.08)', border: '1px solid rgba(201,150,58,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ color: 'rgba(240,235,225,0.4)', fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
            Perdita Accertata
          </p>
          <p style={{ color: '#c9963a', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {totalLoss}
          </p>
        </div>

        {/* Ultime parole */}
        <p style={{ color: 'rgba(240,235,225,0.35)', fontSize: '0.58rem', fontStyle: 'italic', marginBottom: 20, lineHeight: 1.5 }}>
          &ldquo;{lastWords}&rdquo;
        </p>

        {/* Linea finale */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,150,58,0.3), transparent)', marginBottom: 16 }} />

        {/* Footer */}
        <p style={{ color: 'rgba(240,235,225,0.25)', fontSize: '0.5rem', letterSpacing: '0.1em', marginBottom: 2 }}>
          {todayItalian()}
        </p>
        <p style={{ color: 'rgba(240,235,225,0.18)', fontSize: '0.46rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          widestudiodigitale.com
        </p>
      </div>

      {/* Bottone condivisione */}
      <button
        onClick={handleShare}
        disabled={sharing}
        className="mt-4 w-full flex items-center justify-center gap-2 border border-gold/40 text-gold font-body text-xs font-semibold py-3.5 rounded-full hover:bg-gold/8 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {sharing ? (
          'Generando…'
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Condividi il certificato
          </>
        )}
      </button>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

interface Props {
  playerName: string;
  productName: string;
  totalLoss: string;
  lastWords: string;
}

const APP_URL = 'https://game.widestudiodigitale.com/';

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

  function handleWhatsApp() {
    const text = `Ho perso ${totalLoss} vendendo "${productName}". E tu?\n${APP_URL}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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
        <p style={{ color: 'rgba(240,235,225,0.35)', fontSize: '0.58rem', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.5 }}>
          &ldquo;{lastWords}&rdquo;
        </p>

        {/* Linea finale */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,150,58,0.3), transparent)', marginBottom: 12 }} />

        {/* Tagline virale */}
        <p style={{ color: 'rgba(240,235,225,0.3)', fontSize: '0.42rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
          Storia diversa ogni volta · Generata dall&apos;AI · Rovinata da te
        </p>

        {/* Footer */}
        <p style={{ color: 'rgba(240,235,225,0.25)', fontSize: '0.5rem', letterSpacing: '0.1em', marginBottom: 2 }}>
          {todayItalian()}
        </p>
        <p style={{ color: 'rgba(240,235,225,0.18)', fontSize: '0.46rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          widestudiodigitale.com
        </p>
      </div>

      {/* Bottoni condivisione */}
      <div className="flex gap-2.5 mt-4">
        {/* Share generico (nativo / download) */}
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex-1 flex items-center justify-center gap-2 border border-gold/40 text-gold font-body text-xs font-semibold py-3.5 rounded-full hover:bg-gold/8 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
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
              Condividi
            </>
          )}
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-body text-xs font-semibold py-3.5 rounded-full hover:bg-[#25D366]/25 active:scale-[0.98] transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>
      </div>
    </div>
  );
}

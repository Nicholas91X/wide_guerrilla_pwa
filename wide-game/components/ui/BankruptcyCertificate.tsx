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
        // Fallback: download diretto
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
      {/* Certificato — questo viene renderizzato come immagine */}
      <div
        ref={ref}
        className="bg-[#0a0a0a] border border-gold/60 rounded-2xl px-6 py-8 text-center"
        style={{ fontFamily: 'serif' }}
      >
        {/* Intestazione */}
        <p className="text-gold/60 text-[0.6rem] tracking-[0.25em] uppercase mb-1">
          Repubblica Italiana
        </p>
        <p className="text-gold/60 text-[0.6rem] tracking-[0.2em] uppercase mb-5">
          Tribunale Fallimentare
        </p>

        {/* Titolo */}
        <h3 className="text-foreground font-serif text-lg font-bold leading-tight mb-1">
          Certificato
        </h3>
        <h4 className="text-gold text-xs tracking-widest uppercase mb-6">
          di Bancarotta Conclamata
        </h4>

        {/* Linea decorativa */}
        <div className="border-t border-gold/30 mb-6" />

        {/* Corpo */}
        <p className="text-foreground/70 text-xs leading-relaxed mb-4">
          Si certifica che
        </p>
        <p className="text-foreground text-xl font-bold mb-4 tracking-wide">
          {playerName}
        </p>
        <p className="text-foreground/70 text-xs leading-relaxed mb-2">
          ha condotto al fallimento il lancio di
        </p>
        <p className="text-gold text-sm font-semibold italic mb-6">
          &ldquo;{productName}&rdquo;
        </p>

        {/* Perdita */}
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-foreground/60 text-[0.6rem] tracking-widest uppercase mb-1">
            Perdita Accertata
          </p>
          <p className="text-gold text-3xl font-bold tracking-tight">
            {totalLoss}
          </p>
        </div>

        {/* Ultime parole */}
        <p className="text-foreground/50 text-[0.65rem] italic leading-relaxed mb-6">
          &ldquo;{lastWords}&rdquo;
        </p>

        {/* Linea decorativa */}
        <div className="border-t border-gold/30 mb-4" />

        {/* Footer */}
        <p className="text-foreground/40 text-[0.6rem] tracking-wider">
          {todayItalian()}
        </p>
        <p className="text-foreground/30 text-[0.55rem] tracking-widest uppercase mt-1">
          widestudiodigitale.com
        </p>
      </div>

      {/* Bottone condivisione */}
      <button
        onClick={handleShare}
        disabled={sharing}
        className="mt-5 w-full border border-gold/50 text-gold font-body text-sm font-semibold py-3 rounded-full hover:bg-gold/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {sharing ? 'Generando...' : 'Condividi il certificato'}
      </button>
    </div>
  );
}

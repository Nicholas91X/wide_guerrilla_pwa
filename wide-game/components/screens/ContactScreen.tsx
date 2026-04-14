'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import BankruptcyCertificate from '@/components/ui/BankruptcyCertificate';
import { VIDEO_POOLS } from '@/lib/videoPools';
import { useGameStats } from '@/hooks/useGameStats';

const revealTransition = (delay: number) =>
  ({ duration: 0.5, ease: 'easeOut' as const, delay }) as const;

function isValidValue(value: string, type: 'email' | 'whatsapp'): boolean {
  const v = value.trim();
  if (!v) return false;
  if (type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  const digits = v.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export default function ContactScreen() {
  const { state, submitContact, skipContact } = useGame();
  const { totalGames } = useGameStats();
  const [contactType, setContactType] = useState<'email' | 'whatsapp'>('email');
  const [value, setValue] = useState('');
  const [gdpr, setGdpr] = useState(false);

  if (!state) return null;

  // ── Schermata finale post-submit ─────────────────────────────────────────
  if (state.contact.submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center px-5 py-12 text-center">

        <motion.div
          className="w-full max-w-xs mx-auto mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0)}
        >
          <GifSlot pool={VIDEO_POOLS.reveal} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.3)}
          className="mb-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="WIDE Studio Digitale"
            width={64}
            height={64}
            className="mx-auto rounded-full opacity-90"
          />
        </motion.div>

        <motion.p
          className="text-foreground-muted text-xs font-body leading-relaxed mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.5)}
        >
          Il marketing serio lo facciamo noi.
        </motion.p>

        {/* Certificato */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.75)}
        >
          <BankruptcyCertificate
            playerName={state.playerName}
            productName={state.product.name}
            totalLoss={state.totalLoss ?? '€12.450'}
            lastWords={state.lastWords ?? 'Ne è valsa la pena'}
          />
        </motion.div>

        <motion.a
          href="https://widestudiodigitale.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full max-w-xs bg-gold text-background font-body font-semibold py-4 rounded-full text-sm tracking-wide text-center block hover:bg-gold-light active:scale-[0.98] transition-all duration-200"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(1.0)}
        >
          Scopri WIDE
        </motion.a>

      </div>
    );
  }

  // ── Form contatto ────────────────────────────────────────────────────────
  const valid = isValidValue(value, contactType);
  const canSubmit = gdpr && valid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitContact(contactType, value.trim());
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-8 overflow-y-auto">

      {/* Social proof */}
      {totalGames > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-foreground-dim text-[0.55rem] font-body text-center tracking-wide mb-5"
        >
          {totalGames.toLocaleString('it-IT')} imprenditori già falliti
        </motion.p>
      )}

      {/* Header */}
      <div className="mb-7">
        <p className="text-gold/60 text-[0.55rem] font-body tracking-[0.3em] uppercase mb-1">
          Quasi finita
        </p>
        <h2 className="font-display text-[1.9rem] text-foreground font-semibold leading-tight italic">
          Vuoi ricevere la tua storia?
        </h2>
        <p className="text-foreground-muted text-xs font-body mt-2 leading-relaxed">
          Te la mandiamo subito. Nessun altro messaggio.
        </p>
      </div>

      {/* Toggle email / WhatsApp */}
      <div className="flex bg-surface rounded-full p-1 mb-5 border border-gold/20">
        {(['email', 'whatsapp'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setContactType(type); setValue(''); }}
            className={`flex-1 min-h-[44px] rounded-full text-xs font-body font-medium transition-all duration-200 ${
              contactType === type
                ? 'bg-gold text-background shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {type === 'email' ? 'Email' : 'WhatsApp'}
          </button>
        ))}
      </div>

      {/* Input */}
      <input
        type={contactType === 'email' ? 'email' : 'tel'}
        inputMode={contactType === 'email' ? 'email' : 'tel'}
        autoComplete={contactType === 'email' ? 'email' : 'tel'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={contactType === 'email' ? 'la@tuaemail.com' : '+39 333 000 0000'}
        className="w-full bg-surface border border-gold/25 text-foreground font-body px-4 py-3.5 rounded-2xl mb-2 focus:outline-none focus:border-gold/60 focus:bg-surface-elevated placeholder:text-foreground-dim transition-all duration-200 text-sm"
      />

      {/* Testo esplicativo */}
      <AnimatePresence mode="wait">
        <motion.p
          key={contactType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="text-foreground-dim text-[0.6rem] font-body text-center mb-3 px-1 tracking-wide"
        >
          {contactType === 'email'
            ? 'Riceverai la storia di bancarotta via email in pochi secondi.'
            : 'Salveremo il tuo numero e ti contatteremo su WhatsApp entro 24 ore.'}
        </motion.p>
      </AnimatePresence>

      {/* Validazione */}
      {value.trim().length > 0 && !valid && (
        <p className="text-gold/60 text-[0.6rem] font-body mb-3 px-1 text-center">
          {contactType === 'email'
            ? 'Formato email non valido.'
            : 'Inserisci un numero valido (min 9 cifre).'}
        </p>
      )}

      {/* GDPR */}
      <label className="flex items-start gap-3 mb-7 cursor-pointer">
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          className="mt-0.5 accent-gold w-5 h-5 shrink-0 cursor-pointer"
        />
        <span className="text-foreground-muted text-[0.6rem] font-body leading-relaxed">
          Ho letto e accetto la{' '}
          <a
            href="https://widestudiodigitale.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </a>
          {' '}di WIDE Studio Digitale.
        </span>
      </label>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full min-h-[56px] bg-gold text-background font-body font-semibold py-4 rounded-full text-sm tracking-wide hover:bg-gold-light active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        Mandamela
      </button>

      {/* Skip */}
      <button
        onClick={skipContact}
        className="w-full min-h-[44px] mt-2 text-foreground-dim text-xs font-body hover:text-foreground-muted transition-colors duration-200"
      >
        No grazie
      </button>

    </div>
  );
}

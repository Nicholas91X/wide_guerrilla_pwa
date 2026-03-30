'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';
import { VIDEO_POOLS } from '@/lib/videoPools';

const revealTransition = (delay: number) =>
  ({ duration: 0.5, ease: 'easeOut' as const, delay }) as const;

function isValidValue(value: string, type: 'email' | 'whatsapp'): boolean {
  const v = value.trim();
  if (!v) return false;
  if (type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  // WhatsApp: rimuove tutto tranne le cifre, accetta 9-15 digit
  const digits = v.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export default function ContactScreen() {
  const { state, submitContact, skipContact } = useGame();
  const [contactType, setContactType] = useState<'email' | 'whatsapp'>('email');
  const [value, setValue] = useState('');
  const [gdpr, setGdpr] = useState(false);

  if (!state) return null;

  // ── Schermata finale post-submit ───────────────────────────────────────────
  if (state.contact.submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <motion.div
          className="w-full max-w-xs mx-auto mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0)}
        >
          <GifSlot pool={VIDEO_POOLS.reveal} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.3)}
          className="mb-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="WIDE Studio Digitale"
            width={80}
            height={80}
            className="mx-auto"
          />
        </motion.div>

        <motion.p
          className="text-foreground-muted text-sm font-body leading-relaxed mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.5)}
        >
          Il marketing serio lo facciamo noi.
        </motion.p>

        <motion.a
          href="https://widestudiodigitale.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs bg-gold text-background font-body font-semibold py-4 rounded-full text-base text-center block hover:bg-gold-light active:scale-95 transition-all"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.75)}
        >
          Scopri WIDE
        </motion.a>

      </div>
    );
  }

  // ── Form contatto ──────────────────────────────────────────────────────────
  const valid = isValidValue(value, contactType);
  const canSubmit = gdpr && valid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitContact(contactType, value.trim());
  };

  return (
    /* overflow-y-auto permette lo scroll quando la tastiera virtuale è aperta */
    <div className="min-h-screen flex flex-col px-6 py-8 overflow-y-auto">

      <h2 className="font-display text-2xl text-foreground leading-snug mb-2">
        Vuoi ricevere la tua storia di bancarotta?
      </h2>
      <p className="text-foreground-muted text-sm font-body mb-8 leading-relaxed">
        Te la mandiamo subito. Nessun altro messaggio.
      </p>

      {/* Toggle email / WhatsApp — min 44px tap target */}
      <div className="flex rounded-full border border-gold/30 p-1 mb-6">
        {(['email', 'whatsapp'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setContactType(type); setValue(''); }}
            className={`flex-1 min-h-[44px] rounded-full text-sm font-body transition-colors ${
              contactType === type
                ? 'bg-gold text-background font-semibold'
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
        placeholder={
          contactType === 'email' ? 'la@tuaemail.com' : '+39 333 000 0000'
        }
        className="w-full bg-transparent border border-gold/30 text-foreground font-body px-4 py-3 rounded-xl mb-4 focus:outline-none focus:border-gold placeholder:text-foreground-muted/40 transition-colors"
      />

      {/* Testo esplicativo — cambia con fade al toggle */}
      <AnimatePresence mode="wait">
        <motion.p
          key={contactType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground/50 text-xs font-body text-center mb-4 -mt-2 px-1"
        >
          {contactType === 'email'
            ? 'Riceverai la tua storia di bancarotta via email in pochi secondi.'
            : 'Salveremo il tuo numero e ti contatteremo su WhatsApp entro 24 ore.'}
        </motion.p>
      </AnimatePresence>

      {/* Feedback validazione (solo se c'è testo) */}
      {value.trim().length > 0 && !valid && (
        <p className="text-gold/70 text-xs font-body mb-4 -mt-2 px-1">
          {contactType === 'email'
            ? 'Formato email non valido.'
            : 'Inserisci un numero valido (min 9 cifre).'}
        </p>
      )}

      {/* GDPR checkbox */}
      <label className="flex items-start gap-3 mb-8 cursor-pointer">
        {/* L'area cliccabile include sia la checkbox che il testo */}
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          className="mt-0.5 accent-gold w-5 h-5 shrink-0 cursor-pointer"
        />
        <span className="text-foreground-muted text-xs font-body leading-relaxed">
          Ho letto e accetto la{' '}
          <a
            href="https://widestudiodigitale.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </a>
          {' '}di WIDE Studio Digitale.
        </span>
      </label>

      {/* CTA — 56px height per tap target sicuro */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full min-h-[56px] bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        Mandamela
      </button>

      {/* Skip — min 44px tap target */}
      <button
        onClick={skipContact}
        className="w-full min-h-[44px] mt-2 text-foreground-muted text-sm font-body hover:text-foreground transition-colors"
      >
        No grazie
      </button>

    </div>
  );
}

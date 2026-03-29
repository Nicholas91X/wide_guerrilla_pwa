'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import GifSlot from '@/components/ui/GifSlot';

const revealTransition = (delay: number) =>
  ({ duration: 0.5, ease: 'easeOut' as const, delay }) as const;

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
          <GifSlot name="reveal" />
        </motion.div>

        <motion.p
          className="font-display text-3xl text-foreground mb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.3)}
        >
          WIDE Studio Digitale
        </motion.p>

        <motion.p
          className="text-foreground-muted text-sm font-body leading-relaxed mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition(0.5)}
        >
          Il marketing serio lo facciamo noi.
        </motion.p>

        {/* TODO Blocco 6: sostituire href con URL definitivo WIDE */}
        <motion.a
          href="https://widedigitale.it"
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
  const canSubmit = gdpr && value.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    submitContact(contactType, value.trim());
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">

      <h2 className="font-display text-2xl text-foreground leading-snug mb-2">
        Vuoi ricevere la tua storia di bancarotta?
      </h2>
      <p className="text-foreground-muted text-sm font-body mb-8 leading-relaxed">
        Te la mandiamo subito. Nessun altro messaggio.
      </p>

      {/* Toggle email / WhatsApp */}
      <div className="flex rounded-full border border-gold/30 p-1 mb-6">
        {(['email', 'whatsapp'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setContactType(type); setValue(''); }}
            className={`flex-1 py-2 rounded-full text-sm font-body transition-colors ${
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
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          contactType === 'email' ? 'la@tuaemail.com' : '+39 333 000 0000'
        }
        className="w-full bg-transparent border border-gold/30 text-foreground font-body px-4 py-3 rounded-xl mb-4 focus:outline-none focus:border-gold placeholder:text-foreground-muted/40 transition-colors"
      />

      {/* GDPR checkbox */}
      {/* TODO Blocco 6: modale iubenda per Privacy Policy */}
      <label className="flex items-start gap-3 mb-8 cursor-pointer">
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          className="mt-0.5 accent-gold w-4 h-4 shrink-0"
        />
        <span className="text-foreground-muted text-xs font-body leading-relaxed">
          Ho letto e accetto la{' '}
          <span className="text-gold underline">Privacy Policy</span>{' '}
          di WIDE Studio Digitale.
        </span>
      </label>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        Mandamela
      </button>

      {/* Skip */}
      <button
        onClick={skipContact}
        className="w-full mt-4 text-foreground-muted text-sm font-body py-2 hover:text-foreground transition-colors"
      >
        No grazie
      </button>

    </div>
  );
}

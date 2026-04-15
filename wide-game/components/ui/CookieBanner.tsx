'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'wide_cookie_consent';

type ConsentValue = 'accepted' | 'rejected';

function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(CONSENT_KEY);
    if (val === 'accepted' || val === 'rejected') return val;
  } catch { /* private browsing */ }
  return null;
}

function storeConsent(value: ConsentValue) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* noop */ }
}

function pushConsentUpdate() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'consent_accepted' });
}

/** Call this to reopen the banner (e.g. from "Gestisci cookie" link) */
export function reopenCookieBanner() {
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* noop */ }
  window.dispatchEvent(new CustomEvent('wide:reopen-cookie-banner'));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === 'accepted') {
      pushConsentUpdate();
    } else if (stored === null) {
      setVisible(true);
    }

    const onReopen = () => setVisible(true);
    window.addEventListener('wide:reopen-cookie-banner', onReopen);
    return () => window.removeEventListener('wide:reopen-cookie-banner', onReopen);
  }, []);

  const accept = () => {
    storeConsent('accepted');
    pushConsentUpdate();
    setVisible(false);
  };

  const reject = () => {
    storeConsent('rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 12, 8, 0.97)',
        borderTop: '1px solid rgba(201, 150, 58, 0.15)',
        padding: '18px clamp(16px, 5vw, 32px)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          margin: 0,
          flex: '1 1 280px',
          fontFamily: 'var(--font-dm-sans)',
        }}
      >
        Questo sito utilizza cookie analitici per migliorare la tua esperienza.{' '}
        <a
          href="https://widestudiodigitale.com/cookie"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'rgba(201, 150, 58, 0.8)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Cookie Policy
        </a>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            padding: '9px 20px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
          }}
        >
          Rifiuta
        </button>
        <button
          onClick={accept}
          style={{
            padding: '9px 20px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid rgba(201, 150, 58, 0.3)',
            borderRadius: '4px',
            backgroundColor: 'rgba(201, 150, 58, 0.9)',
            color: '#0f0c08',
            cursor: 'pointer',
          }}
        >
          Accetta
        </button>
      </div>
    </div>
  );
}

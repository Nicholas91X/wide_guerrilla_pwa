/**
 * Tracking module — pusha eventi sul dataLayer di GTM.
 * Ogni funzione corrisponde a un punto del funnel di gioco.
 *
 * In GTM questi eventi diventano trigger Custom Event
 * con il nome specificato nel campo "event".
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

function push(event: DataLayerEvent): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

// ── Funnel events ───────────────────────────────────────────────────────────

/** Il giocatore inserisce il nome e avvia la partita */
export function trackGameStart(playerName: string, productName: string): void {
  push({
    event: 'game_start',
    player_name: playerName,
    product_name: productName,
  });
}

/** Il giocatore sceglie un'opzione in una fase */
export function trackChoiceMade(
  step: 1 | 2 | 3,
  choice: string,
  optionIndex: number,
  isBonus: boolean
): void {
  push({
    event: 'choice_made',
    step,
    choice,
    option_index: optionIndex,
    is_bonus: isBonus,
  });
}

/** Una fase è completata (output narrativo letto, si passa alla successiva) */
export function trackStepCompleted(step: 1 | 2 | 3): void {
  push({
    event: 'step_completed',
    step,
  });
}

/** La schermata di conclusione (bancarotta) viene visualizzata */
export function trackConclusionViewed(totalLoss: string): void {
  push({
    event: 'conclusion_viewed',
    total_loss: totalLoss,
  });
}

/** Il giocatore invia il contatto */
export function trackContactSubmitted(contactType: 'email' | 'whatsapp'): void {
  push({
    event: 'contact_submitted',
    contact_type: contactType,
  });
}

/** Il giocatore salta il form contatto */
export function trackContactSkipped(): void {
  push({ event: 'contact_skipped' });
}

/** Il giocatore condivide il certificato */
export function trackCertificateShared(method: 'native' | 'whatsapp' | 'download'): void {
  push({
    event: 'certificate_shared',
    share_method: method,
  });
}

/** Il giocatore clicca "Scopri WIDE" */
export function trackDiscoverWideClicked(): void {
  push({ event: 'discover_wide_clicked' });
}

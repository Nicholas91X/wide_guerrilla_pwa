# WIDE — "Imprenditore per un Giorno" PWA
## Prompt completo per Claude Code

---

## CONTESTO PROGETTO

Stai sviluppando una PWA di guerrilla marketing per **WIDE Studio Digitale**, un'agenzia di marketing digitale con sede a Lerici (La Spezia). La PWA viene raggiunta tramite QR code su adesivi fisici distribuiti in città. L'obiettivo è intrattenere l'utente con un mini-gioco ironico, raccogliere i suoi dati contatto, e rivelare WIDE come autori dell'esperienza.

---

## CONCEPT DEL GIOCO

L'utente interpreta un imprenditore per un giorno. Gli viene assegnato un prodotto reale ma assurdo da vendere (es. "Patch dimagranti con frequenze 5G"). Affronta 3 sfide sequenziali, ognuna con 3 opzioni generate dall'AI. Qualunque scelta faccia, la situazione peggiora in modo grottesco e ironico. Il gioco termina **sempre con la bancarotta** dell'utente, seguita dal reveal di WIDE come soluzione alle sfide di marketing.

### Tono narrativo
Grottesco, ironico, esagerato. Stile "The Office" applicato al business italiano. Le situazioni sono assurde ma hanno una logica plausibile. I personaggi secondari (fornitori, creator, presentatori TV) hanno nomi italiani e caratteristiche ridicole. Il fallimento è epico, mai crudele.

**Esempio di output corretto:**
> "Hai assunto un influencer con 47k follower. Si chiama Mirko. Nel video di presentazione la patch vola sul gatto. Il gatto riceve 4 proposte di collaborazione. Tu nessuna. Mirko ti manda fattura: €1.400 + IVA."

### Struttura narrativa
1. **Intro** — assegnazione prodotto + presentazione tono
2. **Sfida 1 — Il Lancio** — come presenti il prodotto al mondo
3. **Sfida 2 — La Crisi Operativa** — qualcosa va storto nella gestione
4. **Sfida 3 — L'Ultima Spiaggia** — tentativo disperato di salvarsi
5. **Conclusione** — bancarotta epica + reveal WIDE + raccolta dati

---

## STACK TECNICO

- **Framework:** Next.js 14+ (App Router)
- **Animazioni:** Framer Motion
- **Database:** Supabase (piano free)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514) — chiamate server-side via API routes
- **Deploy:** Vercel
- **Stile:** CSS Modules o Tailwind, dark theme
- **PWA:** manifest.json + service worker base per installabilità mobile

---

## ARCHITETTURA

### Struttura cartelle
```
/app
  /api
    /game
      /start/route.ts       — genera prodotto + prima sfida
      /choice/route.ts      — riceve scelta + genera step successivo
      /conclude/route.ts    — genera conclusione personalizzata
    /session
      /save/route.ts        — salva/aggiorna sessione su Supabase
  /page.tsx                 — entry point, gestisce tutti gli step
/components
  /screens
    IntroScreen.tsx
    ChallengeScreen.tsx
    ConclusionScreen.tsx
    ContactScreen.tsx
  /ui
    AnimatedText.tsx
    ChoiceButton.tsx
    LoadingState.tsx
/lib
  /supabase.ts
  /anthropic.ts
/data
  products.json             — pool prodotti
```

### Gestione stato
Tutto lo stato di gioco vive nel frontend (React state / Context). Non si usa localStorage. La struttura dello stato è:

```typescript
interface GameState {
  sessionId: string;           // UUID generato al lancio
  product: Product;            // prodotto assegnato
  currentStep: 1 | 2 | 3 | 'conclusion' | 'contact';
  steps: {
    challenge: string;         // testo sfida generato dall'AI
    options: string[];         // 3 opzioni generate dall'AI
    choice: string | null;     // opzione scelta dall'utente
    output: string | null;     // narrativa conseguenza generata dall'AI
  }[];
  conclusion: string | null;   // testo bancarotta finale
  contact: {
    type: 'email' | 'whatsapp' | null;
    value: string | null;
    submitted: boolean;
  };
}
```

---

## SUPABASE — SCHEMA DATABASE

### Tabella `sessions`
```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  product_name text not null,
  step_1_choice text,
  step_1_output text,
  step_2_choice text,
  step_2_output text,
  step_3_choice text,
  step_3_output text,
  conclusion text,
  contact_type text check (contact_type in ('email', 'whatsapp')),
  contact_value text,
  completed boolean default false
);
```

### Strategia di salvataggio
- Salvataggio step-by-step: ad ogni step completato si fa una `upsert` sulla riga tramite `sessionId`
- La riga viene creata al completamento dello step 1
- Il contatto viene aggiunto come ultimo aggiornamento dopo il form

---

## AI INTEGRATION — LOGICA PROMPT

### Regole fondamentali per tutti i prompt
- Rispondere SEMPRE in italiano
- Tono grottesco, ironico, esagerato ma affettuoso
- Output breve: max 5 righe per gli step, max 8 per la conclusione
- Qualsiasi scelta faccia l'utente, le conseguenze peggiorano sempre
- Introdurre personaggi secondari con nomi italiani e dettagli assurdi
- Non usare mai emoji nel testo narrativo

### System prompt (fisso per tutte le chiamate)
```
Sei il narratore di un gioco ironico chiamato "Imprenditore per un Giorno". 
Il tuo stile è grottesco, esagerato e affettuoso — come un episodio di The Office ambientato 
in una PMI italiana. Scrivi sempre in italiano. Risposte brevi e incisive.

Regola fondamentale: qualunque scelta faccia l'utente, la situazione peggiora sempre. 
Non esistono scelte corrette. Il fallimento è inevitabile e deve sembrare logico 
nonostante sia assurdo. I personaggi secondari (fornitori, collaboratori, clienti) 
hanno nomi italiani e comportamenti ridicoli ma plausibili.

Non usare emoji nel testo narrativo. Non superare le 5 righe per step.
```

### Struttura chiamata Step 1 (Lancio)
```typescript
// Input al prompt
{
  product: string,           // nome prodotto dal JSON
  userChoice: string         // opzione scelta dall'utente
}

// Prompt user
`Prodotto: "${product}"
L'imprenditore ha scelto come strategia di lancio: "${userChoice}"
Descrivi le conseguenze disastrose in 4-5 righe. 
Poi presenta la Sfida 2 "La Crisi Operativa" con 3 nuove opzioni numeriche.`
```

### Struttura chiamata Step 2 e 3
Stessa struttura, ma si aggiunge il contesto degli step precedenti:
```typescript
`Prodotto: "${product}"
Step 1 - Scelta: "${step1.choice}" → Risultato: "${step1.output}"
Step 2 - Scelta: "${step2.choice}"  [solo per step 3]
L'imprenditore ha scelto: "${currentChoice}"
Continua la storia tenendo conto di ciò che è già successo.
Descrivi le conseguenze disastrose in 4-5 righe.`
```

### Chiamata Conclusione
```typescript
`Prodotto: "${product}"
Ecco la storia completa:
- Lancio: scelta "${step1.choice}" → ${step1.output}
- Crisi: scelta "${step2.choice}" → ${step2.output}  
- Ultima spiaggia: scelta "${step3.choice}" → ${step3.output}

Scrivi il testo finale di bancarotta (max 8 righe). 
Deve essere epico, comico, citare dettagli specifici della storia.
Termina con una riga vuota poi esattamente questo testo:
"Non preoccuparti — le sfide del marketing le affrontiamo noi."
Firma: WIDE Studio Digitale`
```

---

## POOL PRODOTTI — `data/products.json`

```json
{
  "products": [
    { "id": 1, "name": "Patch dimagranti da applicare durante il sonno con frequenze 5G", "category": "bellezza" },
    { "id": 2, "name": "Siero anti-età a base di lacrime di coccodrillo biologico", "category": "bellezza" },
    { "id": 3, "name": "Crema anti-cellulite attivabile solo alla luce della luna", "category": "bellezza" },
    { "id": 4, "name": "Integratore di magnetite per allineare il metabolismo con i poli terrestri", "category": "bellezza" },
    { "id": 5, "name": "Cintura vibrante sciogli-pancia da indossare durante le riunioni", "category": "bellezza" },
    { "id": 6, "name": "Crema termogenica che trasforma l'ansia in calorie", "category": "bellezza" },
    { "id": 7, "name": "Shampoo al placenta di alpaca per capelli da CEO", "category": "bellezza" },
    { "id": 8, "name": "Guanti dimagranti in grafene da indossare mentre si mangia", "category": "bellezza" },
    { "id": 9, "name": "Acqua di lusso in bottiglia di cristallo con certificato di purezza astrale", "category": "lifestyle" },
    { "id": 10, "name": "Ombrelli personalizzati per cani con monogramma", "category": "lifestyle" },
    { "id": 11, "name": "Candele profumate al profumo di mattina produttiva", "category": "lifestyle" },
    { "id": 12, "name": "Corsi di comunicazione assertiva per gatti", "category": "formazione" },
    { "id": 13, "name": "Consulenza astrologica per decisioni aziendali", "category": "consulenza" },
    { "id": 14, "name": "Abbonamento mensile a calzini di design con aforismi neurologici", "category": "lifestyle" }
  ]
}
```

> **Nota:** questa lista è provvisoria e incompleta. Il file JSON è la fonte di verità — verrà aggiornato in separata sede senza modificare il codice.

---

## ANTI-BOT & RATE LIMITING

### Strategia
Implementare rate limiting lato server sulle API routes basato su IP:

```typescript
// lib/rateLimit.ts
// Max 5 partite per IP ogni 24 ore
// Usa una tabella Supabase rate_limits oppure un Map in memoria (sufficiente per i volumi attesi)

interface RateLimit {
  ip: string;
  count: number;
  reset_at: timestamptz;
}
```

### Implementazione suggerita
- Tabella Supabase `rate_limits (ip, count, reset_at)`
- Ad ogni chiamata a `/api/game/start` verificare e incrementare il counter
- Se count > 5 nelle ultime 24h → restituire 429 con messaggio ironico in tema: *"Anche tu sei andato in bancarotta troppe volte oggi. Riprova domani."*

---

## RACCOLTA DATI & FRIZIONE MINIMA

### Principio
Il form contatto appare **dopo** il reveal di WIDE, quando l'utente è nel momento di massimo engagement. Non prima.

### UX del form
- Una sola schermata, minimalista
- Titolo: *"Vuoi ricevere la tua storia di bancarotta?"* (pretesto simpatico)
- Toggle visibile: **Email** / **WhatsApp**
- Un solo campo input che cambia placeholder in base al toggle
- Checkbox GDPR non pre-spuntato (obbligatorio)
- Testo GDPR: link all'informativa iubenda, si apre in modale
- CTA: *"Mandamela"*
- Skip link sottile: *"No grazie"* (non obbligatorio, ma il dato è perso)

### Cosa succede dopo il submit
1. Supabase `upsert` aggiunge contatto alla sessione
2. Se email: inviare mail transazionale con testo della storia (usare Resend o Supabase Edge Functions)
3. Se WhatsApp: il numero viene salvato, il follow-up è manuale da parte di WIDE
4. L'utente vede una schermata finale con CTA al sito WIDE

---

## GDPR

- Informativa Privacy: generare con **iubenda** intestata ad Alessia Amoruso (P.IVA da inserire)
- Cookie Policy: solo se si aggiungono analytics (GA4). Per ora non necessaria.
- Consenso: checkbox esplicito, non pre-spuntato, obbligatorio per submit
- Dati raccolti: contatto (email o WhatsApp) + storia di gioco anonimizzata
- Retention: da specificare nell'informativa (suggerito: 12 mesi)

---

## DESIGN & ANIMAZIONI

### Estetica
- **Tema:** dark, elegante, con accenti dorati/ambrati
- **Font display:** carattere serif o slab con personalità forte (es. Playfair Display, Cormorant, DM Serif) — niente Inter, Roboto, Arial
- **Font body:** leggibile e moderno (es. Syne, Outfit, Be Vietnam)
- **Palette:** background #0D0D0D o simile, testi crema/avorio, accenti #C9963A (oro) o simile
- **Atmosfera:** evoca il mondo del business senza essere corporate — come un club esclusivo che ride di sé stesso

### Animazioni con Framer Motion + GIF
Ogni transizione tra step è gestita con Framer Motion. Le GIF fornite dalla collaboratrice vengono integrate come elementi `<img>` nei punti chiave del flusso.

**Specifiche per le GIF (da comunicare alla collaboratrice):**
- Formato: GIF ottimizzata (compressione con Ezgif o equivalente)
- Peso: sotto 500KB per GIF — obbligatorio per performance mobile
- Dimensioni: 390px di larghezza, altezza variabile — ottimizzate per viewport mobile
- Colori: palette ridotta (max 128 colori) per contenere il peso
- Le GIF vengono precaricate al mount del componente per evitare flickering

**GIF necessarie (una per ogni momento chiave):**
1. `intro.gif` — apertura drammatica, atmosfera da boardroom
2. `challenge-1.gif` — Sfida 1, tono energico/ottimista (il lancio)
3. `challenge-2.gif` — Sfida 2, tono caotico (la crisi operativa)
4. `challenge-3.gif` — Sfida 3, tono disperato (l'ultima spiaggia)
5. `conclusion.gif` — crollo epico (grafico che precipita, edificio che crolla, cartoon style)
6. `loading.gif` — attesa generazione AI (grafici che oscillano, spinner con $)
7. `reveal.gif` — entrata pulita e moderna del logo WIDE

**Comportamento animazioni Framer Motion (tutto il resto):**
- **Sfide:** testo narrativo appare parola per parola (typewriter effect)
- **Scelte:** i bottoni entrano con stagger (uno dopo l'altro, leggero delay)
- **Transizioni tra step:** fade + slide verticale, max 0.4 secondi
- **Reveal WIDE:** entrata pulita e moderna che contrasta con il caos precedente

---

## DESKTOP BLOCK

La PWA è progettata esclusivamente per mobile. Chi accede da desktop (rilevato via `window.innerWidth` o user agent) deve vedere una schermata bloccante che non permette di proseguire.

### Comportamento
- Rilevazione al mount dell'app root
- Se desktop → mostra `DesktopBlockScreen` a tutto schermo, il gioco non si carica
- Nessun workaround (non è un messaggio di avviso, è un blocco totale)

### Copy della schermata
```
🎩 Questo gioco è pensato per smartphone.

Inquadra il QR code con il tuo telefono
e scopri cosa ti aspetta.

— WIDE Studio Digitale
```

### Stile
Stessa estetica dark/oro del resto del gioco. Centrare verticalmente. Aggiungere il logo WIDE in fondo. Nessun link, nessuna alternativa.

---

## GA4 — ANALYTICS

Integrare Google Analytics 4 dal Blocco 1 per avere dati puliti fin dall'inizio.

### Setup
- Installare `@next/third-parties` (package ufficiale Next.js per GA4)
- Property GA4 da creare su Google Analytics (il Measurement ID va in `.env.local` come `NEXT_PUBLIC_GA_ID`)
- Nessun cookie banner necessario se si configura GA4 in modalità anonimizzata (no cookie di profilazione) — da valutare con iubenda

### Eventi custom da tracciare

```typescript
// Evento: gioco avviato
gtag('event', 'game_start', {
  product_name: product.name,
  product_category: product.category
});

// Evento: scelta effettuata
gtag('event', 'step_choice', {
  step: 1 | 2 | 3,
  choice: 'A' | 'B' | 'C'
});

// Evento: step abbandonato (beforeunload)
gtag('event', 'game_abandoned', {
  last_step: currentStep
});

// Evento: conclusione raggiunta
gtag('event', 'game_completed');

// Evento: contatto lasciato
gtag('event', 'contact_submitted', {
  contact_type: 'email' | 'whatsapp'
});

// Evento: CTA WIDE cliccata
gtag('event', 'wide_cta_click');
```

### Funnel leggibile su GA4
Questi eventi permettono di vedere su GA4:
- Quante scansioni QR generano una partita avviata
- A quale step si abbandona di più
- Tasso di completamento
- Tasso di conversione contatto
- Tasso di click sulla CTA finale

---

## PWA

### manifest.json
```json
{
  "name": "Imprenditore per un Giorno",
  "short_name": "WIDE Game",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D0D",
  "theme_color": "#C9963A",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker
Base minimale: cache dei file statici per funzionamento offline parziale. Non serve gestire offline gaming — la connessione è necessaria per le chiamate AI.

---

## PIANO DI SVILUPPO IN 6 BLOCCHI

### Blocco 1 — Setup & Struttura
- Init Next.js 14 con TypeScript
- Configurazione Supabase (client + schema SQL)
- Variabili d'ambiente (Anthropic API key, Supabase URL/key, GA4 Measurement ID)
- Deploy base su Vercel
- Manifest PWA
- Integrazione GA4 con `@next/third-parties`
- Componente `DesktopBlockScreen` — blocco totale per utenti desktop

### Blocco 2 — Engine di Gioco
- Stato globale (Context o Zustand)
- Routing tra i 5 step (Intro → S1 → S2 → S3 → Conclusione → Contatto)
- Caricamento prodotto random da products.json
- Struttura componenti schermata

### Blocco 3 — AI Integration
- API route `/api/game/start` — genera prodotto e prima sfida
- API route `/api/game/choice` — riceve scelta, genera output + sfida successiva
- API route `/api/game/conclude` — genera testo bancarotta finale
- Gestione errori e timeout

### Blocco 4 — Supabase Integration
- API route `/api/session/save` — upsert step-by-step
- Rate limiting anti-bot
- Salvataggio contatto finale

### Blocco 5 — Micro-animazioni
- Framer Motion per tutte le transizioni tra step
- Typewriter effect per testo narrativo
- Loading state AI
- Integrazione GIF nei 4 punti chiave (intro, loading, conclusione, reveal)
- Precaricamento GIF al mount per evitare flickering
- Reveal finale WIDE

### Blocco 6 — GDPR, Form Contatto & QA
- Form contatto con toggle email/WhatsApp
- Modale informativa iubenda
- Test flusso completo
- Test mobile (iPhone Safari prioritario)
- Ottimizzazione performance

---

## NOTE OPERATIVE

- **Chiavi API:** non committare mai nel repo. Usare `.env.local` per sviluppo, variabili Vercel per produzione.
- **Priorità mobile:** il 100% degli utenti arriverà da mobile (QR scan). Desktop è secondario.
- **Browser target:** iOS Safari 16+, Chrome Android 110+
- **Lingua:** tutta l'interfaccia in italiano
- **Partire dal Blocco 1** e procedere in ordine. Non anticipare blocchi successivi prima del completamento di quello corrente.

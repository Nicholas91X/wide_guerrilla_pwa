'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { GameState, Product, StepData } from '@/types/game';
import productsData from '@/data/products.json';

// ─── Tipi del context ────────────────────────────────────────────────────────

interface GameContextType {
  state: GameState | null;
  loading: boolean;
  startGame: () => void;
  chooseOption: (choice: string) => void;
  continueToNext: () => void;
  proceedToContact: () => void;
  submitContact: (type: 'email' | 'whatsapp', value: string) => void;
  skipContact: () => void;
  // Blocco 3: aggiunge setStepData(idx, data) e setConclusion(text)
  // per popolare lo stato dopo le risposte AI
}

// ─── Context e hook ──────────────────────────────────────────────────────────

const GameContext = createContext<GameContextType | null>(null);

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame deve essere usato dentro GameProvider');
  return ctx;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandomProduct(): Product {
  const list = productsData.products;
  return list[Math.floor(Math.random() * list.length)];
}

// Contenuto placeholder — in Blocco 3 sarà generato dall'AI
function makeInitialSteps(): [StepData, StepData, StepData] {
  return [
    {
      challenge: 'Come vuoi presentare il tuo prodotto al mercato italiano?',
      options: [
        'Ingaggia un influencer da 50k follower per un video virale',
        'Acquista uno spazio pubblicitario in prima serata su Rete 4',
        'Lancia una campagna TikTok con hashtag dedicato',
      ],
      choice: null,
      output: null,
    },
    {
      challenge:
        'La produzione è in ritardo di tre settimane. I clienti iniziano a scrivere sui social.',
      options: [
        'Offri rimborsi parziali con coupon del 10%',
        'Assumi un responsabile logistica: si chiama Gennaro, ex postino',
        'Scarica la colpa sul fornitore cinese in una nota stampa',
      ],
      choice: null,
      output: null,
    },
    {
      challenge:
        'Sei a corto di liquidità. Hai tre settimane prima del crac. Ultima mossa.',
      options: [
        'Pitch alla camera di commercio: PowerPoint di 47 slide',
        'Lancia una raccolta fondi su GoFundMe con video emozionale',
        'Vendi i diritti del prodotto a un concorrente per €800',
      ],
      choice: null,
      output: null,
    },
  ];
}

// Output narrativi placeholder per ciascuno step
const PLACEHOLDER_OUTPUTS: [string, string, string] = [
  'Mirko pubblica il video. Il prodotto compare per 3 secondi, poi il suo gatto prende il sopravvento. Il gatto riceve 4 proposte di collaborazione. Tu nessuna. Mirko ti manda fattura: €1.400 + IVA.',
  'Gennaro consegna 40 pacchi ai vicini sbagliati. Tre clienti aprono dispute su PayPal. Gennaro chiede aumento. Tu non puoi permettertelo. Gennaro se ne va portando con sé il registro delle spedizioni.',
  'Il pitch dura 47 minuti. La commissione si addormenta alla slide 12. Al termine ti chiedono se hai un sito web. Hai un sito fatto con Wix nel 2019. Decidi di non mostrarlo. Saggio.',
];

const PLACEHOLDER_CONCLUSION =
  'Hai venduto 3 unità — due alla zia e una a te stesso per testare il prodotto. Costi totali: €34.700. Ricavi totali: €89,70.\n\nIl liquidatore si chiama Adelmo. Adelmo è gentile. Ti dice che va bene così.\n\nNon va bene così.\n\nNon preoccuparti — le sfide del marketing le affrontiamo noi.\n\n— WIDE Studio Digitale';

// ─── Provider ────────────────────────────────────────────────────────────────

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false); // usato in Blocco 3

  const startGame = useCallback(() => {
    setState({
      sessionId: crypto.randomUUID(),
      product: pickRandomProduct(),
      currentStep: 1,
      steps: makeInitialSteps(),
      conclusion: null,
      contact: { type: null, value: null, submitted: false },
    });
  }, []);

  const chooseOption = useCallback(
    (choice: string) => {
      if (!state || typeof state.currentStep !== 'number') return;
      const idx = (state.currentStep - 1) as 0 | 1 | 2;
      const newSteps = [...state.steps] as typeof state.steps;
      newSteps[idx] = {
        ...newSteps[idx],
        choice,
        output: PLACEHOLDER_OUTPUTS[idx],
      };
      setState({ ...state, steps: newSteps });
    },
    [state]
  );

  const continueToNext = useCallback(() => {
    if (!state) return;
    if (state.currentStep === 1) {
      setState({ ...state, currentStep: 2 });
    } else if (state.currentStep === 2) {
      setState({ ...state, currentStep: 3 });
    } else if (state.currentStep === 3) {
      setState({
        ...state,
        currentStep: 'conclusion',
        conclusion: PLACEHOLDER_CONCLUSION,
      });
    }
  }, [state]);

  const proceedToContact = useCallback(() => {
    if (!state) return;
    setState({ ...state, currentStep: 'contact' });
  }, [state]);

  const submitContact = useCallback(
    (type: 'email' | 'whatsapp', value: string) => {
      if (!state) return;
      setState({ ...state, contact: { type, value, submitted: true } });
    },
    [state]
  );

  const skipContact = useCallback(() => {
    if (!state) return;
    setState({ ...state, contact: { ...state.contact, submitted: true } });
  }, [state]);

  return (
    <GameContext.Provider
      value={{
        state,
        loading,
        startGame,
        chooseOption,
        continueToNext,
        proceedToContact,
        submitContact,
        skipContact,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

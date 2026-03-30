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
  error: string | null;
  startGame: () => Promise<void>;
  chooseOption: (choice: string) => Promise<void>;
  continueToNext: () => Promise<void>;
  proceedToContact: () => void;
  submitContact: (type: 'email' | 'whatsapp', value: string) => void;
  skipContact: () => void;
}

// ─── Fetch con timeout ───────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 25000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// ─── Session save helper ─────────────────────────────────────────────────────

async function saveSession(s: GameState): Promise<void> {
  try {
    await fetch('/api/session/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: s.sessionId,
        productName: s.product.name,
        step1Choice: s.steps[0].choice,
        step1Output: s.steps[0].output,
        step2Choice: s.steps[1].choice,
        step2Output: s.steps[1].output,
        step3Choice: s.steps[2].choice,
        step3Output: s.steps[2].output,
        conclusion: s.conclusion,
        contactType: s.contact.type,
        contactValue: s.contact.value,
        completed: s.contact.submitted,
      }),
    });
  } catch (err) {
    console.error('[saveSession]', err);
  }
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

function emptyStep(): StepData {
  return { narrative: null, challenge: '', options: [], choice: null, output: null };
}

function makeInitialSteps(): [StepData, StepData, StepData] {
  return [emptyStep(), emptyStep(), emptyStep()];
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── startGame ──────────────────────────────────────────────────────────────
  const startGame = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    const product = pickRandomProduct();
    const sessionId = crypto.randomUUID();

    try {
      const res = await fetchWithTimeout('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: product.name }),
      });

      if (!res.ok) throw new Error(`/api/game/start → ${res.status}`);

      const data = (await res.json()) as {
        narrative: string;
        challenge: string;
        options: string[];
        pitch: string;
      };

      const steps = makeInitialSteps();
      steps[0] = {
        narrative: data.narrative,
        challenge: data.challenge,
        options: data.options,
        choice: null,
        output: null,
      };

      setState({
        sessionId,
        product,
        pitch: data.pitch ?? null,
        currentStep: 1,
        steps,
        conclusion: null,
        contact: { type: null, value: null, submitted: false },
      });
    } catch (err) {
      console.error('[startGame]', err);
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      setError(isTimeout
        ? 'Il server ci ha messo troppo. Riprova.'
        : 'Qualcosa è andato storto. Riprova.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // ── chooseOption ───────────────────────────────────────────────────────────
  // Aggiornamento ottimistico: registra subito la scelta, poi carica l'output AI
  const chooseOption = useCallback(
    async (choice: string) => {
      if (!state || typeof state.currentStep !== 'number' || loading) return;

      const step = state.currentStep as 1 | 2 | 3;
      const idx = step - 1;

      // 1. Registra la scelta immediatamente (stato ottimistico)
      setState((prev) => {
        if (!prev) return prev;
        const newSteps = [...prev.steps] as typeof prev.steps;
        newSteps[idx] = { ...newSteps[idx], choice };
        return { ...prev, steps: newSteps };
      });

      setLoading(true);

      // 2. Costruisce il contesto degli step precedenti
      const previousSteps = state.steps
        .slice(0, idx)
        .filter((s) => s.choice !== null && s.output !== null)
        .map((s) => ({ choice: s.choice!, output: s.output! }));

      try {
        const res = await fetchWithTimeout('/api/game/choice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: state.product.name,
            step,
            choice,
            previousSteps,
          }),
        });

        if (!res.ok) throw new Error(`/api/game/choice → ${res.status}`);

        const data = (await res.json()) as {
          output: string;
          challenge?: string;
          options?: string[];
        };

        // 3. Aggiorna output dello step corrente + dati dello step successivo
        setState((prev) => {
          if (!prev) return prev;
          const newSteps = [...prev.steps] as typeof prev.steps;

          newSteps[idx] = { ...newSteps[idx], choice, output: data.output };

          if (step < 3 && data.challenge && data.options) {
            newSteps[idx + 1] = {
              ...newSteps[idx + 1],
              challenge: data.challenge,
              options: data.options,
            };
          }

          return { ...prev, steps: newSteps };
        });

        // Fire-and-forget: salva la sessione con l'output appena ricevuto
        const updatedSteps = [...state.steps] as typeof state.steps;
        updatedSteps[idx] = { ...updatedSteps[idx], choice, output: data.output };
        void saveSession({ ...state, steps: updatedSteps });
      } catch (err) {
        console.error('[chooseOption]', err);
        // Rollback: rimuove la scelta ottimistica in caso di errore
        setState((prev) => {
          if (!prev) return prev;
          const newSteps = [...prev.steps] as typeof prev.steps;
          newSteps[idx] = { ...newSteps[idx], choice: null };
          return { ...prev, steps: newSteps };
        });
      } finally {
        setLoading(false);
      }
    },
    [state, loading]
  );

  // ── continueToNext ─────────────────────────────────────────────────────────
  const continueToNext = useCallback(async () => {
    if (!state || loading) return;

    if (state.currentStep === 1) {
      setState({ ...state, currentStep: 2 });
    } else if (state.currentStep === 2) {
      setState({ ...state, currentStep: 3 });
    } else if (state.currentStep === 3) {
      // Step 3: chiama /conclude per generare il testo di bancarotta
      setLoading(true);
      try {
        const res = await fetchWithTimeout('/api/game/conclude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: state.product.name,
            steps: state.steps.map((s) => ({
              choice: s.choice ?? '',
              output: s.output ?? '',
            })),
          }),
        });

        if (!res.ok) throw new Error(`/api/game/conclude → ${res.status}`);

        const data = (await res.json()) as { conclusion: string };

        const newState: GameState = { ...state, currentStep: 'conclusion', conclusion: data.conclusion };
        setState(newState);
        void saveSession(newState);
      } catch (err) {
        console.error('[continueToNext/conclude]', err);
      } finally {
        setLoading(false);
      }
    }
  }, [state, loading]);

  // ── Azioni contact ─────────────────────────────────────────────────────────
  const proceedToContact = useCallback(() => {
    if (!state) return;
    setState({ ...state, currentStep: 'contact' });
  }, [state]);

  const submitContact = useCallback(
    (type: 'email' | 'whatsapp', value: string) => {
      if (!state) return;
      const newState: GameState = { ...state, contact: { type, value, submitted: true } };
      setState(newState);
      void saveSession(newState);
    },
    [state]
  );

  const skipContact = useCallback(() => {
    if (!state) return;
    const newState: GameState = { ...state, contact: { ...state.contact, submitted: true } };
    setState(newState);
    void saveSession(newState);
  }, [state]);

  return (
    <GameContext.Provider
      value={{
        state,
        loading,
        error,
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

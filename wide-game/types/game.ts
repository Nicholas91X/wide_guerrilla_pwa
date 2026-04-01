export interface Product {
  id: number;
  name: string;
  category: string;
  image?: string;
}

export interface StepData {
  narrative: string | null; // testo intro generato da AI (solo step 1, da /start)
  challenge: string;
  options: string[];
  choice: string | null;
  output: string | null;
  spent: string | null;      // es. "€2.340" — importo speso in questa fase
  spentLabel: string | null; // es. "Stampa 3.000 volantini" — voce di spesa
}

export interface GameContact {
  type: 'email' | 'whatsapp' | null;
  value: string | null;
  submitted: boolean;
}

export interface GameState {
  sessionId: string;
  playerName: string;
  product: Product;
  pitch: string | null;
  currentStep: 1 | 2 | 3 | 'conclusion' | 'contact';
  steps: [StepData, StepData, StepData];
  conclusion: string | null;       // BLOCCO 1: bancarotta
  conclusionBridge: string | null; // BLOCCO 2: il ponte verso WIDE
  initialBudget: number;
  totalLoss: string | null;
  lastWords: string | null;
  contact: GameContact;
}

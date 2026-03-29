export interface Product {
  id: number;
  name: string;
  category: string;
}

export interface StepData {
  narrative: string | null; // testo intro generato da AI (solo step 1, da /start)
  challenge: string;
  options: string[];
  choice: string | null;
  output: string | null;
}

export interface GameContact {
  type: 'email' | 'whatsapp' | null;
  value: string | null;
  submitted: boolean;
}

export interface GameState {
  sessionId: string;
  product: Product;
  currentStep: 1 | 2 | 3 | 'conclusion' | 'contact';
  steps: [StepData, StepData, StepData];
  conclusion: string | null;
  contact: GameContact;
}

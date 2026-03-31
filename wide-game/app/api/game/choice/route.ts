import { NextRequest, NextResponse } from 'next/server';
import { anthropic, SYSTEM_PROMPT } from '@/lib/anthropic';

type PreviousStep = { choice: string; output: string };

const STEP_NAMES: Record<1 | 2 | 3, string> = {
  1: 'Il Posizionamento',
  2: 'La Campagna',
  3: 'Il Piano B',
};

export async function POST(request: NextRequest) {
  try {
    const { product, step, choice, previousSteps } = (await request.json()) as {
      product: string;
      step: 1 | 2 | 3;
      choice: string;
      previousSteps: PreviousStep[];
    };

    if (!product || !step || !choice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Accumula il contesto degli step precedenti
    const contextLines = (previousSteps ?? [])
      .map(
        (s, i) =>
          `Step ${i + 1} (${STEP_NAMES[(i + 1) as 1 | 2 | 3]}) - Scelta: "${s.choice}" → Risultato: "${s.output}"`
      )
      .join('\n');

    const isLastStep = step === 3;

    // Prompt seguendo esattamente la struttura del documento di progetto
    let userPrompt: string;
    if (step === 1) {
      userPrompt = `Prodotto: "${product}"
Il marketer ha scelto come strategia di posizionamento: "${choice}"
Descrivi le conseguenze in 4-5 righe seguendo i 3 movimenti.
Poi presenta la Sfida 2 "La Campagna" con 3 opzioni.`;
    } else {
      userPrompt = `Prodotto: "${product}"
${contextLines}
Il marketer ha scelto: "${choice}"
Continua la storia tenendo conto di ciò che è già successo.
Descrivi le conseguenze in 4-5 righe seguendo i 3 movimenti.${
        !isLastStep
          ? `\nPoi presenta la Sfida 3 "Il Piano B" con 4 opzioni: le prime 3 sono mosse normali, la quarta è l'opzione estero (bonus).`
          : "\nQuesta è l'ultima mossa prima del collasso totale."
      }`;
    }

    if (isLastStep) {
      // Step 3: solo output narrativo, nessuna sfida successiva
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: [
          {
            name: 'game_choice_final',
            description: "Risposta per l'ultima sfida, senza sfida successiva",
            input_schema: {
              type: 'object' as const,
              properties: {
                output: {
                  type: 'string',
                  description:
                    'Prima riga: frase titolo in MAIUSCOLO (es. "MOSSA AUDACE."). Poi 3-4 righe con la tecnica in 3 movimenti: (1) esecuzione iper-realistica con nomi propri italiani e cifre reali, (2) svolta assurda con logica interna, (3) conseguenza laterale grottesca. No emoji.',
                },
              },
              required: ['output'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'game_choice_final' },
        messages: [{ role: 'user', content: userPrompt }],
      });

      const toolBlock = response.content.find((b) => b.type === 'tool_use');
      if (!toolBlock || toolBlock.type !== 'tool_use') {
        return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 });
      }
      return NextResponse.json(toolBlock.input);
    } else {
      // Step 1 o 2: output + prossima sfida con 3 opzioni
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: [
          {
            name: 'game_choice',
            description: 'Risposta con conseguenze narrative e sfida successiva',
            input_schema: {
              type: 'object' as const,
              properties: {
                output: {
                  type: 'string',
                  description:
                    'Prima riga: frase titolo in MAIUSCOLO (es. "OTTIMA SCELTA.", "IDEA GENIALE."). Poi 3-4 righe con la tecnica in 3 movimenti: (1) esecuzione iper-realistica con nomi propri italiani e cifre reali, (2) svolta assurda con logica interna, (3) conseguenza laterale grottesca. No emoji.',
                },
                challenge: {
                  type: 'string',
                  description: 'Domanda sulla prossima decisione di marketing, 1-2 righe. Deve emergere naturalmente dal disastro appena descritto.',
                },
                options: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Per la Sfida 2 (La Campagna): esattamente 3 opzioni. Per la Sfida 3 (Il Piano B): esattamente 4 opzioni, la quarta è sempre l\'opzione estero (bonus). Max 20 parole ciascuna. Senza numero iniziale.',
                },
              },
              required: ['output', 'challenge', 'options'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'game_choice' },
        messages: [{ role: 'user', content: userPrompt }],
      });

      const toolBlock = response.content.find((b) => b.type === 'tool_use');
      if (!toolBlock || toolBlock.type !== 'tool_use') {
        return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 });
      }
      return NextResponse.json(toolBlock.input);
    }
  } catch (err) {
    console.error('[/api/game/choice]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

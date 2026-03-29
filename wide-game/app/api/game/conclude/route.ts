import { NextRequest, NextResponse } from 'next/server';
import { anthropic, SYSTEM_PROMPT } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { product, steps } = (await request.json()) as {
      product: string;
      steps: { choice: string; output: string }[];
    };

    if (!product || !steps || steps.length !== 3) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Prompt esatto dal documento di progetto
    const userPrompt = `Prodotto: "${product}"
Ecco la storia completa:
- Lancio: scelta "${steps[0].choice}" → ${steps[0].output}
- Crisi: scelta "${steps[1].choice}" → ${steps[1].output}
- Ultima spiaggia: scelta "${steps[2].choice}" → ${steps[2].output}

Scrivi il testo finale di bancarotta (max 8 righe).
Deve essere epico, comico, citare dettagli specifici della storia.
Termina con una riga vuota poi esattamente questo testo:
"Non preoccuparti — le sfide del marketing le affrontiamo noi."
Firma: WIDE Studio Digitale`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'game_conclude',
          description: 'Testo finale epico di bancarotta',
          input_schema: {
            type: 'object' as const,
            properties: {
              conclusion: {
                type: 'string',
                description:
                  'Testo di bancarotta, max 8 righe, con firma WIDE finale. No emoji.',
              },
            },
            required: ['conclusion'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'game_conclude' },
      messages: [{ role: 'user', content: userPrompt }],
    });

    const toolBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 });
    }

    return NextResponse.json(toolBlock.input);
  } catch (err) {
    console.error('[/api/game/conclude]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

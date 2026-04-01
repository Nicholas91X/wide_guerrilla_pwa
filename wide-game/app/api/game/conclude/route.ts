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
Ecco la sfida di marketing completa:
- Il Posizionamento: scelta "${steps[0].choice}" → ${steps[0].output}
- La Campagna: scelta "${steps[1].choice}" → ${steps[1].output}
- Il Piano B: scelta "${steps[2].choice}" → ${steps[2].output}

Scrivi la conclusione seguendo esattamente i due blocchi del sistema.
BLOCCO 1 (bancarotta): constata il fallimento in modo asciutto, cita personaggi e dettagli specifici.
BLOCCO 2 (il ponte): rompi il personaggio, una frase diretta che fa da ponte tra il fallimento e WIDE Studio Digitale.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'game_conclude',
          description: 'Testo finale di bancarotta in due blocchi separati',
          input_schema: {
            type: 'object' as const,
            properties: {
              bancarotta: {
                type: 'string',
                description:
                  'BLOCCO 1: dichiarazione di bancarotta. Tono da referto. Cita personaggi e dettagli specifici della storia. Max 4 righe. No emoji.',
              },
              ponte: {
                type: 'string',
                description:
                  'BLOCCO 2: il narratore rompe il personaggio. Una sola frase secca, diretta, che chiude la storia e introduce l\'idea che il marketing fatto bene esiste — senza nominare WIDE, senza essere paternalistico, senza "hai fatto del tuo meglio". Il tono è quello di qualcuno che constata un fatto ovvio. Es: "Il marketing non è un\'improvvisazione — almeno non dovrebbe esserlo.", "Da qualche parte esiste chi sa come farlo. Non eri tu, ma esiste.", "Fine della simulazione. Là fuori è diverso." OBBLIGATORIO.',
              },
            },
            required: ['bancarotta', 'ponte'],
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
    const isOverloaded =
      typeof err === 'object' && err !== null &&
      'status' in err && (err as { status: number }).status === 529;
    if (isOverloaded) {
      return NextResponse.json({ error: 'overloaded' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

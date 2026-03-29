import { NextRequest, NextResponse } from 'next/server';
import { anthropic, SYSTEM_PROMPT } from '@/lib/anthropic';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      '127.0.0.1';

    const { allowed, message } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    const { product } = (await request.json()) as { product: string };

    if (!product || typeof product !== 'string') {
      return NextResponse.json({ error: 'product required' }, { status: 400 });
    }

    const userPrompt = `Prodotto: "${product}"

Presenta questo prodotto all'imprenditore: 2-3 righe di introduzione ironica e grottesca.
Poi presenta la Sfida 1 "Il Lancio": come vuole presentare il prodotto al mercato italiano?
Fornisci esattamente 3 opzioni numeriche, brevi, credibili ma destinate al disastro.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [
        {
          name: 'game_start',
          description: "Risposta strutturata per l'inizio del gioco",
          input_schema: {
            type: 'object' as const,
            properties: {
              narrative: {
                type: 'string',
                description: 'Introduzione ironica del prodotto, max 3 righe. No emoji.',
              },
              challenge: {
                type: 'string',
                description: 'Testo della Sfida 1 (Il Lancio), 1-2 righe.',
              },
              options: {
                type: 'array',
                items: { type: 'string' },
                description: 'Esattamente 3 opzioni brevi (max 15 parole ciascuna).',
              },
            },
            required: ['narrative', 'challenge', 'options'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'game_start' },
      messages: [{ role: 'user', content: userPrompt }],
    });

    const toolBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 });
    }

    return NextResponse.json(toolBlock.input);
  } catch (err) {
    console.error('[/api/game/start]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

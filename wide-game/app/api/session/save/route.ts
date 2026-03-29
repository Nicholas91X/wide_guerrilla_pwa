import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface SaveSessionBody {
  sessionId: string;
  productName: string;
  step1Choice?: string | null;
  step1Output?: string | null;
  step2Choice?: string | null;
  step2Output?: string | null;
  step3Choice?: string | null;
  step3Output?: string | null;
  conclusion?: string | null;
  contactType?: string | null;
  contactValue?: string | null;
  completed?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveSessionBody;

    if (!body.sessionId || !body.productName) {
      return NextResponse.json(
        { error: 'sessionId and productName required' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('sessions').upsert(
      {
        id: body.sessionId,
        product_name: body.productName,
        step_1_choice: body.step1Choice ?? null,
        step_1_output: body.step1Output ?? null,
        step_2_choice: body.step2Choice ?? null,
        step_2_output: body.step2Output ?? null,
        step_3_choice: body.step3Choice ?? null,
        step_3_output: body.step3Output ?? null,
        conclusion: body.conclusion ?? null,
        contact_type: body.contactType ?? null,
        contact_value: body.contactValue ?? null,
        completed: body.completed ?? false,
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('[/api/session/save]', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/session/save]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

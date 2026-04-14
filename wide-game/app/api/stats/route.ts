import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

let cached: { count: number; ts: number } | null = null;
const TTL = 5 * 60 * 1000; // 5 minuti

export async function GET() {
  try {
    if (cached && Date.now() - cached.ts < TTL) {
      return NextResponse.json({ totalGames: cached.count });
    }

    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[/api/stats]', error);
      return NextResponse.json({ totalGames: cached?.count ?? 0 });
    }

    cached = { count: count ?? 0, ts: Date.now() };
    return NextResponse.json({ totalGames: count ?? 0 });
  } catch (err) {
    console.error('[/api/stats]', err);
    return NextResponse.json({ totalGames: cached?.count ?? 0 });
  }
}

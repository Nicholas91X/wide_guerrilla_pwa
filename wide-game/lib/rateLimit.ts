import { supabase } from '@/lib/supabase';

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; message?: string }> {
  // Bypass in development
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true };
  }

  try {
    const { data, error } = await supabase
      .from('rate_limits')
      .select('ip, count, reset_at')
      .eq('ip', ip)
      .maybeSingle();

    if (error) {
      console.error('[rateLimit] select error:', error);
      return { allowed: true }; // fail open
    }

    const now = new Date();

    if (!data) {
      // First time this IP — insert record
      const { error: insertError } = await supabase.from('rate_limits').insert({
        ip,
        count: 1,
        reset_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      });
      if (insertError) console.error('[rateLimit] insert error:', insertError);
      return { allowed: true };
    }

    const resetAt = new Date(data.reset_at);

    if (now > resetAt) {
      // Window expired — reset
      const { error: updateError } = await supabase
        .from('rate_limits')
        .update({
          count: 1,
          reset_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('ip', data.ip);
      if (updateError) console.error('[rateLimit] reset error:', updateError);
      return { allowed: true };
    }

    if (data.count >= 5) {
      return {
        allowed: false,
        message:
          'Anche tu sei andato in bancarotta troppe volte oggi. Riprova domani.',
      };
    }

    // Increment count
    const { error: incError } = await supabase
      .from('rate_limits')
      .update({ count: data.count + 1 })
      .eq('ip', data.ip);
    if (incError) console.error('[rateLimit] increment error:', incError);

    return { allowed: true };
  } catch (err) {
    console.error('[rateLimit] unexpected error:', err);
    return { allowed: true }; // fail open
  }
}

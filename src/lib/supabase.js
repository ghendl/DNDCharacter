
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const env = window.__DND_ENV__ || {};
export const SUPABASE_URL = env.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || '';
export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

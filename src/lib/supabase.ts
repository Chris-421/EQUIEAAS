import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Add these values in `.env.local`. The public values are safe for the browser.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Keep this server-side only. Do not expose it with NEXT_PUBLIC_.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function logEnvWarning(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message);
  }
}

export function hasSupabaseEnv() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function getSupabaseConfigError() {
  if (!SUPABASE_URL) {
    return 'Missing NEXT_PUBLIC_SUPABASE_URL.';
  }

  if (!SUPABASE_ANON_KEY) {
    return 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.';
  }

  return null;
}

export function getSupabaseRuntimeStatus() {
  return {
    hasUrl: Boolean(SUPABASE_URL),
    hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
  };
}

export function createSupabaseServerClient(options?: {
  admin?: boolean;
}): SupabaseClient | null {
  const envError = getSupabaseConfigError();
  if (envError) {
    logEnvWarning(`[supabase] ${envError}`);
    return null;
  }

  const key =
    options?.admin && SUPABASE_SERVICE_ROLE_KEY
      ? SUPABASE_SERVICE_ROLE_KEY
      : SUPABASE_ANON_KEY!;

  return createClient(SUPABASE_URL!, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * The browser client must use only the public Supabase URL and anon key.
 * Failing clearly here prevents an empty-key runtime error and never exposes
 * or substitutes a service-role credential.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'CivicFix Supabase configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the Next.js server.',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

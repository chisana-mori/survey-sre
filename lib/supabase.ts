import { createClient } from '@supabase/supabase-js';

// Support both standard and Vercel-integration/custom specific variable names found in logs
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_VITE_SUPABASE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or Vercel Project Settings.', {
    urlFound: !!supabaseUrl,
    keyFound: !!supabaseAnonKey
  });
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

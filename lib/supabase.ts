import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debugging for Vercel deployment
console.log('Supabase Config Debug:', {
  urlExists: !!supabaseUrl,
  urlLength: supabaseUrl?.length,
  keyExists: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  mode: import.meta.env.MODE,
  allKeys: Object.keys(import.meta.env).filter(k => k.startsWith('NEXT_PUBLIC_'))
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or Vercel Project Settings.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

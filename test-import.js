// 测试 import 是否有问题
import { supabase } from './lib/supabase.ts';

console.log('Supabase client:', supabase);
console.log('Environment check:', {
  hasUrl: !!import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: !!import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

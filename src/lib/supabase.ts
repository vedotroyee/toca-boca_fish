import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to check if we are using the mock client (so we can fallback to localStorage for dev without keys)
export const isMockSupabase = supabaseUrl === 'https://mock.supabase.co';

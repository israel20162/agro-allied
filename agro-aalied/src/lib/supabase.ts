import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_KEY

if (!url || !anonKey) {
  // Fail loudly during development instead of showing an empty shop.
  console.error('Missing SUPABASE_URL or SUPABASE_KEY. Copy .env.example to .env.')
}

export const supabase = createClient(url ?? '', anonKey ?? '')

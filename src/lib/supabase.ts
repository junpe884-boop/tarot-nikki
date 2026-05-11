import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CardReading = {
  id: string
  user_id: string
  date: string
  card_name: string
  card_number: number
  is_reversed: boolean
  message: string
  diary_text: string | null
  created_at: string
}

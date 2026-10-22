import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kgiahfdkabtqpkdxcxup.supabase.co'
const supabaseKey = 'sb_publishable_4hUikzdHjdBB1B1m6f9VAA_Cnxi8Am8'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type UserProfile = {
  user_id: string
  email: string
  display_name: string
  total_storage?: number
}
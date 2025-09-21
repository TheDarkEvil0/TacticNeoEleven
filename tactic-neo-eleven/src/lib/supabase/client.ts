import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para manejo de errores
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error)
  return {
    success: false,
    error: (error as Error)?.message || 'Error desconocido'
  }
}

// Helper para respuestas exitosas
export const handleSupabaseSuccess = (data: unknown) => {
  return {
    success: true,
    data
  }
}
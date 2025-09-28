// lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// --- CONFIGURACIÓN DE VARIABLES DE ENTORNO ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidas.');
}

// --- 1. CLIENTE PARA COMPONENTES DE CLIENTE (AuthForm, EditPlayerForm) ---
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- 2. CLIENTE PARA SERVER COMPONENTS (app/page.tsx) ---
// Usa cookies para gestionar la sesión en el servidor.
export function createSupabaseServerClient() {
    const cookieStore = cookies();

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}

// --- 3. LÓGICA DE SUBIDA DE IMAGEN (Mantenida) ---
export async function uploadPlayerImage(file: File, playerId: number): Promise<string | null> {
    if (!file) return null;

    const BUCKET_NAME = 'jugadores_fotos'; // Usamos el nombre plural corregido

    const fileExt = file.name.split('.').pop();
    const fileName = fileExt ? `jugador-${playerId}-${Date.now()}.${fileExt}` : `jugador-${playerId}-${Date.now()}`;
    const filePath = `${BUCKET_NAME}/${fileName}`; 

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME) 
        .upload(filePath, file, {
            cacheControl: '3600', 
            upsert: true,
        });

    if (uploadError) {
        console.error('Error al subir la imagen:', uploadError);
        throw new Error('Error en Supabase Storage: No se pudo subir el archivo. Revisa los permisos del bucket "jugadores_fotos".');
    }

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
    
    return publicUrlData?.publicUrl || null;
}
// app/page.tsx

import { createSupabaseServerClient } from '@/lib/supabase';
import AuthForm from '@/components/LoginForm';
import PlayersList from '@/components/PlayerList'; // ¡Asegúrate de haber movido tu código principal aquí!

// Esto asegura que la sesión se verifique en cada visita
export const dynamic = 'force-dynamic'; 

export default async function Home() {
    // 1. OBTENER CLIENTE DE SERVIDOR
    const supabase = createSupabaseServerClient();
    
    // 2. VERIFICAR SESIÓN
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si no hay sesión, mostramos el Login
    if (!session) {
        return (
            <main style={{ padding: '20px' }}>
                <AuthForm />
            </main>
        );
    }

    // Si hay sesión, mostramos la aplicación principal (la lista de jugadores)
    return (
        <main style={{ padding: '20px' }}>
            <PlayersList />
        </main>
    );
}
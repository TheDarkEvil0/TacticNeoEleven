// components/AuthForm.tsx

"use client";

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase'; // Importamos el cliente de lado del cliente

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const method = isLogin 
            ? supabase.auth.signInWithPassword 
            : supabase.auth.signUp;

        const { error: authError } = await method({ email, password });

        if (authError) {
            // Manejamos errores específicos para el registro vs login
            if (!isLogin && authError.message.includes('User already registered')) {
                setError('Este correo ya está registrado. Por favor, inicia sesión.');
            } else if (!isLogin && authError.message.includes('Password should be at least 6 characters')) {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                setError(authError.message || `Error en ${isLogin ? 'Login' : 'Registro'}.`);
            }
        } else {
            // Éxito: forzamos la recarga de la página para que app/page.tsx detecte la nueva sesión.
            window.location.reload(); 
        }

        setIsLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#004d99' }}>
                {isLogin ? 'Iniciar Sesión' : 'Registrar Cuenta'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {error && (
                    <p style={{ color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '10px', borderRadius: '4px', backgroundColor: '#fff0f0' }}>
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ 
                        padding: '10px', 
                        backgroundColor: isLoading ? '#007bff' : '#468847',
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.15s ease'
                    }}
                >
                    {isLoading 
                        ? (isLogin ? 'Iniciando...' : 'Registrando...') 
                        : (isLogin ? 'Acceder' : 'Crear Cuenta')
                    }
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    disabled={isLoading}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#004d99', 
                        cursor: 'pointer', 
                        textDecoration: 'underline',
                        fontSize: '14px'
                    }}
                >
                    {isLogin 
                        ? '¿No tienes cuenta? Regístrate aquí.' 
                        : '¿Ya tienes cuenta? Inicia sesión.'
                    }
                </button>
            </div>
        </div>
    );
}
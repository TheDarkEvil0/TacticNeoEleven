'use client' 

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Conectando...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test simple de conexión sin consultar tablas
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setConnectionStatus(`❌ Error de conexión: ${error.message}`)
        } else {
          // Si llegamos aquí, la conexión funciona
          setConnectionStatus('✅ Conexión con Supabase exitosa!')
        }
      } catch (err: any) {
        setConnectionStatus(`❌ Error: ${err.message || 'Error desconocido'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            ⚽ Tactic Neo Eleven
          </h1>
          <p className="text-gray-600 mb-8">
            Sistema de Gestión de Club de Fútbol
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Next.js + TypeScript:</span>
                <span className="text-green-600 font-semibold">✅ Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tailwind CSS:</span>
                <span className="text-green-600 font-semibold">✅ Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Supabase:</span>
                <span className={connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {connectionStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Fase 1: Fundaciones Sólidas</h3>
            <p className="text-blue-700 text-left">
              <strong>Objetivo:</strong> Base funcional mínima pero robusta
              <br />
              <strong>Duración:</strong> 2-3 semanas
              <br />
              <strong>Estado:</strong> Setup inicial completado
            </p>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p><strong>Versión:</strong> 0.1.0 - Setup inicial</p>
            <p><strong>Próximo paso:</strong> Crear catálogos maestros</p>
            <p><strong>Desarrollado con:</strong> Next.js 14 + Supabase + Tailwind CSS</p>
          </div>
        </div>
      </div>
    </main>
  )
}
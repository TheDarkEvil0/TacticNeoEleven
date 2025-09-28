// components/AddPlayerForm.tsx

"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

// Tipos adaptados para la lista de posiciones
interface CategoriaDisplay {
    id_categoria: number;
    nombre_categoria: string;
    estado: boolean;
}

interface AddPlayerFormProps {
    onPlayerAdded: () => void;
    categorias: CategoriaDisplay[];
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onPlayerAdded, categorias }) => {
    const [nombre, setNombre] = useState('');
    const [dorsal, setDorsal] = useState<number | null>(null);
    const [posicion, setPosicion] = useState('');
    const [imagen, setImagen] = useState(''); // NUEVO ESTADO para la imagen
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || dorsal === null || !posicion) return;

        setLoading(true);

        const { data, error } = await supabase
            .from('jugadores')
            .insert({
                nombre_jugadores: nombre,
                dorsal_jugadores: dorsal,
                posicion_jugadores: posicion,
                imagen_jugadores: imagen.trim() === '' ? null : imagen, // Guarda la URL o null
            })
            .select();

        setLoading(false);

        if (error) {
            console.error('Error al añadir el jugador:', error.message);
            alert('Error al añadir el jugador: ' + error.message);
        } else {
            setNombre('');
            setDorsal(null);
            setPosicion('');
            setImagen('');
            onPlayerAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3>Añadir Nuevo Jugador</h3>
            
            <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Nombre completo" 
                required 
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            
            <input 
                type="number" 
                value={dorsal ?? ''} 
                onChange={(e) => setDorsal(parseInt(e.target.value) || null)} 
                placeholder="Dorsal" 
                required 
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            
            <select 
                value={posicion} 
                onChange={(e) => setPosicion(e.target.value)} 
                required
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
                <option value="">Selecciona Posición</option>
                {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.nombre_categoria}>{cat.nombre_categoria}</option>
                ))}
            </select>

            {/* NUEVO: Input de la URL de la Imagen */}
            <div style={{ marginBottom: '5px' }}>
                <label htmlFor="imagen_add" style={{ fontSize: '14px', color: '#555' }}>URL Imagen (Opcional):</label>
                <input
                    id="imagen_add"
                    type="url"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    placeholder="Ej: https://ejemplo.com/foto.png"
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                {imagen && (
                    <img 
                        src={imagen} 
                        alt="Vista previa" 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px' }}
                    />
                )}
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                style={{ 
                    padding: '10px', 
                    backgroundColor: loading ? '#ccc' : '#004d99', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Añadiendo...' : 'Añadir Jugador'}
            </button>
        </form>
    );
};

export default AddPlayerForm;
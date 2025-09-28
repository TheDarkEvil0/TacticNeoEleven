// components/EditPlayerForm.tsx

"use client";

import { useState, FormEvent } from 'react';
// Importamos la función de subida y el cliente de Supabase (asumiendo que allí está la función de UPDATE)
import { supabase, uploadPlayerImage } from '@/lib/supabase'; 
import { Jugador } from '@/types/index'; 

// Tipos para las posiciones
interface CategoriaDisplay {
    id_categoria: number;
    nombre_categoria: string;
    estado: boolean;
}

interface EditPlayerFormProps {
    jugador: Jugador;
    onSave: (jugador: Jugador) => void;
    onCancel: () => void;
    categorias: CategoriaDisplay[];
}

export default function EditPlayerForm({ jugador, onSave, onCancel, categorias }: EditPlayerFormProps) {
    const [nombre, setNombre] = useState(jugador.nombre_jugadores);
    const [dorsal, setDorsal] = useState(jugador.dorsal_jugadores.toString());
    const [posicion, setPosicion] = useState(jugador.posicion_jugadores); 
    
    // La URL de imagen que está actualmente en la BD
    const [existingImageUrl, setExistingImageUrl] = useState(jugador.imagen_jugadores || '');
    // El archivo seleccionado para subir
    const [file, setFile] = useState<File | null>(null); 
    // La URL para mostrar la previsualización (local o la existente)
    const [previewUrl, setPreviewUrl] = useState(jugador.imagen_jugadores || '');
    // Estado de carga
    const [isLoading, setIsLoading] = useState(false);

    // Manejador para cuando el usuario selecciona un archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        
        if (selectedFile) {
            // Crea una URL temporal para la previsualización local
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            // Vuelve a la imagen de Supabase existente si se deselecciona
            setPreviewUrl(existingImageUrl);
        }
    };
    
    // Manejador para eliminar la imagen
    const handleRemoveImage = () => {
        setFile(null);
        setExistingImageUrl('');
        setPreviewUrl('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // El estado de carga se activa inmediatamente
        setIsLoading(true);

        const parsedDorsal = parseInt(dorsal) || null; 
        
        if (!nombre || parsedDorsal === null || !posicion) {
            alert('Por favor, completa Nombre, Dorsal y Posición.');
            setIsLoading(false);
            return;
        }

        let newImageUrl: string | null = existingImageUrl;
        
        try {
            // 1. LÓGICA DE SUBIDA DE IMAGEN
            if (file) {
                newImageUrl = await uploadPlayerImage(file, jugador.id_jugadores);
            } else if (!previewUrl) {
                newImageUrl = null;
            }

            // 2. CONSTRUIR EL OBJETO JUGADOR ACTUALIZADO
            const updatedJugador: Jugador = {
                ...jugador,
                nombre_jugadores: nombre,
                dorsal_jugadores: parsedDorsal,
                posicion_jugadores: posicion,
                imagen_jugadores: newImageUrl,
            };

            // 3. LLAMAR A ON SAVE
            onSave(updatedJugador);

        } catch (error) {
            alert(`Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            // Se desactiva el estado de carga al finalizar (éxito o error)
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* ENCABEZADO VISUAL DEL JUGADOR Y INPUT DE ARCHIVO */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingBottom: '15px', 
                borderBottom: '1px solid #eee',
                position: 'relative', 
                height: '80px', 
                marginBottom: '10px'
            }}>
                
                {/* 1. Imagen o Placeholder (Usando previewUrl) */}
                {previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt={`Imagen de ${nombre}`} 
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #004d99' }}
                    />
                ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', border: '2px solid #ccc' }}>👤</div>
                )}

                {/* 2. Input de Archivo Oculto */}
                <input 
                    type="file" 
                    id="file-upload"
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }} 
                    disabled={isLoading}
                />
                
                {/* 3. Botón de Subida (Label) */}
                <label 
                    htmlFor="file-upload" 
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: '120px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: '#468847',
                        color: 'white',
                        border: '2px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                    title="Subir/Cambiar Imagen"
                >
                    &#x1F4F7;
                </label>
                
                {/* 4. Botón de Eliminar Imagen */}
                {previewUrl && (
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: '90px', 
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                        title="Eliminar Imagen"
                    >
                        &times;
                    </button>
                )}
            </div>
            
            {/* Campos de Nombre, Dorsal y Posición (Resto del formulario) */}
            <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Nombre completo" 
                required 
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                disabled={isLoading}
            />
            
            <input 
                type="number" 
                value={dorsal} 
                onChange={(e) => setDorsal(e.target.value)} 
                placeholder="Dorsal" 
                required 
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                disabled={isLoading}
            />
            
            <select 
                value={posicion} 
                onChange={(e) => setPosicion(e.target.value)} 
                required
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                disabled={isLoading}
            >
                <option value="">Selecciona Posición</option>
                {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.nombre_categoria}>{cat.nombre_categoria}</option>
                ))}
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={onCancel} style={{ padding: '10px', backgroundColor: '#ddd', border: 'none', borderRadius: '4px' }} disabled={isLoading}>Cancelar</button>
                
                {/* BOTÓN DE GUARDAR ACTUALIZADO CON FEEDBACK VISUAL */}
                <button 
                    type="submit" 
                    style={{ 
                        padding: '10px', 
                        // Cambio de color y opacidad al cargar
                        backgroundColor: isLoading ? '#007bff' : '#004d99', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: isLoading ? 'not-allowed' : 'pointer', 
                        opacity: isLoading ? 0.9 : 1, 
                        transition: 'all 0.1s ease', // Transición rápida para que se sienta instantáneo
                    }} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
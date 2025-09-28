// types/index.ts

export interface Jugador {
  id_jugadores: number; 
  nombre_jugadores: string;
  dorsal_jugadores: number;
  posicion_jugadores: string;
  imagen_jugadores: string | null; 
}

// NUEVA INTERFACE
export interface CategoriaPosicion {
  id_categoria: number;
  nombre_categoria: string;
  estado: boolean;
}

// ACTUALIZACIÓN DE INTERFACES EXISTENTES
export interface AddPlayerFormProps {
  onPlayerAdded: () => void;
  categorias: CategoriaPosicion[]; // AÑADIDO
}

export interface EditPlayerRowProps {
  jugador: Jugador;
  onSave: (jugador: Jugador) => void;
  onCancel: () => void;
  categorias: CategoriaPosicion[]; // AÑADIDO
}
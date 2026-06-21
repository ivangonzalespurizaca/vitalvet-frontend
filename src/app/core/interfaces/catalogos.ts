export interface Especie {
  idEspecie: number;
  nombreEspecie: string;
  activo: boolean;
}

export interface Raza {
  idRaza: number;
  nombreRaza: string;
  idEspecie: number;
  nombreEspecie: string;
  activo: boolean;
}

export interface Especialidad {
  idEspecialidad: number;
  nombreEspecialidad: string;
  activo: boolean;
}
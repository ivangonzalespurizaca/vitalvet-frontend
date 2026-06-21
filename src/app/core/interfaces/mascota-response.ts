export interface MascotaResponseDTO {
  idMascota: number;
  codigoMascota: string;
  nombreMascota: string;
  sexo: 'MACHO' | 'HEMBRA';
  fechaNacimiento: string;
  pesoActual: number;
  fotoUrl: string | null;
  idCliente: number;
  idRaza: number;
  nombreRaza: string;
  idEspecie: number;
  nombreEspecie: string;
  activo: boolean;
}

export interface MascotasResponse {
  idPersona: number;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  celular: string;
  totalMascotas: number;
  mascotas: MascotaResponseDTO[];
}
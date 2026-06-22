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
export interface VacunaResponseDTO {
  idAplicacion: number;
  nombreVacuna: string;
  dosis: string;
  fechaAplicacion: string | null;
  proximaDosis: string | null;
  estado: 'APLICADA' | 'PROGRAMADA';
}

export interface CarnetVacunaDTO {
  nombreMascota: string;
  codigoMascota: string;
  sexo: 'MACHO' | 'HEMBRA' ;
  fechaNacimiento: string;
  pesoActual: number;
  fotoUrl: string;
  nombreEspecie: string;
  nombreRaza: string;
  vacunas: VacunaResponseDTO[];
}

export interface VacunaRegistroRequestDTO {
  idVacuna: number;
  dosisTipo: string;
  fecha: string; 
}
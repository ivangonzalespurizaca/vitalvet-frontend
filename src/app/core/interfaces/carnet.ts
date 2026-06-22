export interface VacunaResponseDTO {
  idAplicacion: number;
  nombreVacuna: string;
  dosis: string;
  fechaAplicacion: string;
  proximaDosis: string;
  estado: string;
  descripcion?: string;
}

export interface CarnetVacunaDTO {
  codigoMascota: string;
  nombreMascota: string;
  sexo: 'MACHO' | 'HEMBRA';
  fechaNacimiento: string;
  pesoActual: number;
  fotoUrl: string;
  nombreRaza: string;
  nombreEspecie: string;
  vacunas: VacunaResponseDTO[];
}

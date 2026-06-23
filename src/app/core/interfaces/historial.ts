export interface EventoHistorialDTO {
  idEvento: number;
  tipo: 'CONSULTA MÉDICA' | 'INMUNIZACIÓN';
  fecha: string;
  atendidoPor: string;
  especialidad?: string;
  // Campos específicos de Consulta Médica
  peso?: number;
  temperatura?: number;
  motivo?: string;
  diagnosticoClinico?: string;
  recomendacionesTratamiento?: string;
  // Campos específicos de Inmunización
  nombreVacuna?: string;
  descripcionVacuna?: string;
  nroDosis?: number;
  proximaFecha?: string;
}

export interface HistorialClinicoResponseDTO {
  codigoMascota: string;
  nombreMascota: string;
  sexo: 'MACHO' | 'HEMBRA';
  fechaNacimiento: string;
  fotoUrl: string | null;
  nombreRaza: string;
  nombreEspecie: string;
  edadTexto: string; // Ej: "2 años, 4 meses"
  eventos: EventoHistorialDTO[];
}

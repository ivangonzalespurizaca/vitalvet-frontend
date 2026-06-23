export interface VacunaAplicadaDTO {
  idVacuna: number;
  proximaDosis: string;
  nroDosis: string;
}

export interface ConsultaRequestDTO {
  idCita: number;
  idVeterinario?: number;
  pesoActual: number;
  temperatura: number;
  diagnostico: string;
  recomendaciones: string;
  vacunas: VacunaAplicadaDTO[];
}


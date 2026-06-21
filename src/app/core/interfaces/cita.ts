import { ApiResponse } from './api-response';

export type TipoEstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';

export interface SlotDTO {
  hora: string;
  disponible: boolean;
}

export interface CitaRequestDTO {
  idMascota: number;
  idVeterinario: number;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm:ss
  motivo?: string;
  idCliente: number;
  tipoDocumento: string;
  metodoPago: string;
  montoTotal: number;
}

export interface CitaResponseDTO {
  idCita: number;
  codigoCita: string;
  idMascota: number;
  idVeterinario: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: TipoEstadoCita;
  fechaCreacion: string;
}

export interface CitaPanelResponse extends CitaResponseDTO {
  nombreMascota: string;
  razaMascota: string;
  nombrePropietario: string;
  dniPropietario: string;
  nombreMedico: string;
  idCliente: number;
}

export interface ConsultaDetalleDTO {
  idConsulta: number;
  pesoActual: number;
  temperatura: number;
  diagnostico: string;
  recomendaciones: string;
}

export interface CitaDetalleResponse {
  idCita: number;
  codigoCita: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: TipoEstadoCita;
  idMascota: number;
  nombreMascota: string;
  nombrePropietario: string;
  nombreMedico: string;
  consulta?: ConsultaDetalleDTO;
}
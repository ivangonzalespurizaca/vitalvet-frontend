export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export interface HorarioDetalle {
  idHorario: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface HorarioResponse {
  dni: string;
  nombreCompleto: string;
  especialidad: string;
  horarios: HorarioDetalle[];
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje: string;
  data: T;
}

export interface HorarioRequest {
    idVeterinario: number;
    diaSemana: DiaSemana;
    horaInicio: string; // Formato "HH:mm:ss" o "HH:mm"
    horaFin: string;    // Formato "HH:mm:ss" o "HH:mm"
}
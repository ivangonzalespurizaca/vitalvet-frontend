export interface AgendaBloqueResponseDTO {
  hora: string;
  disponible: boolean;
  idCita: number | null;
  nombreMascota: string | null;
  razaMascota: string | null;
  nombrePropietario: string | null;
  dniPropietario: string | null;
  motivoConsulta: string | null;
}
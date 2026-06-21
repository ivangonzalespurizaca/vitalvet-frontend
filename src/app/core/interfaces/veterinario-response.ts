export interface VeterinarioResponse {
  idVeterinario: number;
  dni: string;
  nombres: string;
  apellidos: string;
  email: string;
  nroColegiatura: string;
  especialidad: string;
  idEspecialidad: number;
  fotoUrl: string;
  activo: boolean;
  celular: string;
  genero: string;
  nombreCompletoConEspecialidad: string;
}
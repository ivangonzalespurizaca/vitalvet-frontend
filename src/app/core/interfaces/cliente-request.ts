export interface PersonaRequestDTO {
  nombres: string;
  apellidos: string;
  dni: string;
  celular?: string; 
  genero: 'MASCULINO' | 'FEMENINO' | 'NO_ESPECIFICADO';
}

export interface MascotaRequestDTO {
  nombreMascota: string; 
  idRaza: number;        
  sexo: string;         
  fechaNacimiento?: string; 
  idCliente?: number;
  pesoActual?: number;
  fotoUrl?: string;
}

export interface RegistroRapidoDTO {
  datosCliente: PersonaRequestDTO;
  datosMascota: MascotaRequestDTO;
}
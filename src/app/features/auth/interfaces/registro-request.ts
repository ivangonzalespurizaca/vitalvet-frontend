export interface RegistroWebDTO {
  datosCliente: {
    email: string;
    contrasenia: string;
    nombres: string;
    apellidos: string;
    dni: string;
    celular?: string;
    genero: 'MASCULINO' | 'FEMENINO' | 'NO_ESPECIFICADO';
  };
  datosMascota: {
    nombreMascota: string;
    idRaza: number | null;
    sexo: 'MACHO' | 'HEMBRA';
    fechaNacimiento?: string;
  };
}
export interface CitaProxima {
  nombreMascota: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
}

export interface AlertaVacuna {
  nombreMascota: string;
  nombreVacuna: string;
  fechaVencimiento: string;
  nivelAlerta: string;
}

export interface ClienteDashboard {
  nombreCliente: string;
  cantidadMascotas: number;
  proximasCitas: CitaProxima[];
  vacunasProximas: AlertaVacuna[];
}

export interface ComprobanteRecienteDTO {
  nombreCliente: string;
  codigoComprobante: string;
  montoTotal: number;
  metodoPago: string;
}

export interface AdminDashboardDTO {
  ingresosTotalesHoy: number;
  cantidadCitasHoy: number;
  cantidadPacientesRegistrados: number;
  ultimosPagos: ComprobanteRecienteDTO[];
  citasPorEstado: { [key: string]: number }; // Map en Java es un objeto en TS
}

export interface VeterinarioDashboardDTO {
  pacientesEnEspera: number;
  pacientesAtendidosHoy: number;
  siguientePaciente: string;
  atencionesRecientes: CitaProxima[];
  proximasCitas: CitaProxima[];
}
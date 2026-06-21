export interface ComprobanteDTO {
    idComprobante: number;
    tipoComprobante: string;
    codigoComprobante: string;
    fechaPago: string;
    metodoPago: string;
    montoTotal: number;
    nombreCliente: string;
    montoSubtotal: number;
    montoImpuesto: number;
    dniCliente: string;
}

export interface ComprobanteAdminResponse {
  contenido: ComprobanteDTO[];
  totalComprobantesEmitidos: number;
  montoTotalRecaudado: number;
}

export interface ComprobanteClienteResponse {
  contenido: ComprobanteDTO[];
}
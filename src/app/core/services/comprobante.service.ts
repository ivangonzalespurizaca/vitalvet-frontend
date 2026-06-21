import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { ComprobanteAdminResponse, ComprobanteClienteResponse } from '../interfaces/comprobante';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.gatewayUrl}/api/agenda/comprobantes`;

  /**
   * Consulta el historial (Para Administradores)
   */
  consultarHistorial(
    tipo?: string, 
    inicio?: string, 
    fin?: string
  ): Observable<ComprobanteAdminResponse> {
    let params = new HttpParams();
    if (tipo) params = params.set('tipo', tipo);
    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);

    return this.http.get<ApiResponse<ComprobanteAdminResponse>>(`${this.apiUrl}/historial`, { params })
      .pipe(map(res => res.data));
  }

  obtenerMisComprobantes(
    tipo?: string, 
    inicio?: string, 
    fin?: string
  ): Observable<ComprobanteClienteResponse> {
    let params = new HttpParams();
    if (tipo) params = params.set('tipo', tipo);
    if (inicio) params = params.set('inicio', inicio);
    if (fin) params = params.set('fin', fin);

    return this.http.get<ApiResponse<ComprobanteClienteResponse>>(`${this.apiUrl}/mis-comprobantes`, { params })
      .pipe(map(res => res.data));
  }
}
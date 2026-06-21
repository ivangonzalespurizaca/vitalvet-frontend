import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { 
  SlotDTO, CitaRequestDTO, CitaResponseDTO, 
  CitaPanelResponse, CitaDetalleResponse 
} from '../interfaces/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.gatewayUrl}/api/agenda/cita`;

  listarSlotsDisponibles(idVeterinario: number, fecha: string): Observable<ApiResponse<SlotDTO[]>> {
    const params = new HttpParams()
      .set('idVeterinario', idVeterinario.toString())
      .set('fecha', fecha);
    return this.http.get<ApiResponse<SlotDTO[]>>(`${this.apiUrl}/slots`, { params });
  }

  registrarCita(dto: CitaRequestDTO): Observable<ApiResponse<CitaResponseDTO>> {
    return this.http.post<ApiResponse<CitaResponseDTO>>(`${this.apiUrl}/registrar`, dto);
  }

  obtenerPanelCitas(estado?: string, buscar?: string): Observable<ApiResponse<CitaPanelResponse[]>> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (buscar) params = params.set('buscar', buscar);
    
    return this.http.get<ApiResponse<CitaPanelResponse[]>>(`${this.apiUrl}/panel`, { params });
  }

  obtenerDetalleCita(idCita: number): Observable<ApiResponse<CitaDetalleResponse>> {
    return this.http.get<ApiResponse<CitaDetalleResponse>>(`${this.apiUrl}/detalle/${idCita}`);
  }

  completarCitaInterno(idCita: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/interno/${idCita}/completar`, {});
  }
}
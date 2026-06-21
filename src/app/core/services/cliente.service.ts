import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { ClienteResponse } from '../interfaces/cliente-response';
import { RegistroRapidoDTO, PersonaRequestDTO } from '../interfaces/cliente-request';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.gatewayUrl}/api/cliente`;

  listarClientes(criterio?: string): Observable<ApiResponse<ClienteResponse[]>> {
    let params = new HttpParams();
    if (criterio && criterio.trim() !== '') {
      params = params.set('criterio', criterio.trim());
    }
    return this.http.get<ApiResponse<ClienteResponse[]>>(`${this.apiUrl}/listar`, { params });
  }

  registroRapido(data: RegistroRapidoDTO): Observable<ApiResponse<ClienteResponse>> {
    return this.http.post<ApiResponse<ClienteResponse>>(`${this.apiUrl}/registro-rapido`, data);
  }

  obtenerPorId(id: number): Observable<ApiResponse<ClienteResponse>> {
    return this.http.get<ApiResponse<ClienteResponse>>(`${this.apiUrl}/${id}`);
  }

  editarCliente(id: number, data: PersonaRequestDTO): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/editar/${id}`, data);
  }

  buscarPorDni(dni: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/interno/dni/${dni}`);
  }
}
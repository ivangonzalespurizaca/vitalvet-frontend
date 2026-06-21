import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { VeterinarioResponse } from '../interfaces/veterinario-response';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private http = inject(HttpClient);
  // Ajusta la URL base según tu arquitectura (ej. el puerto 8091 que mostraste)
  private apiUrl = `${environment.gatewayUrl}/api/usuario/veterinario`;

  obtenerPorId(id: number): Observable<ApiResponse<VeterinarioResponse>> {
    return this.http.get<ApiResponse<VeterinarioResponse>>(`${this.apiUrl}/${id}`);
  }

  listarVeterinarios(buscar: string = ''): Observable<ApiResponse<VeterinarioResponse[]>> {
    const params = new HttpParams().set('buscar', buscar);
    
    return this.http.get<ApiResponse<VeterinarioResponse[]>>(this.apiUrl, { params });
  }

  registrarVeterinario(veterinario: any): Observable<ApiResponse<VeterinarioResponse>> {
    return this.http.post<ApiResponse<VeterinarioResponse>>(`${this.apiUrl}/registrar`, veterinario);
  }

  editarVeterinario(id: number, veterinario: any): Observable<ApiResponse<VeterinarioResponse>> {
    return this.http.put<ApiResponse<VeterinarioResponse>>(`${this.apiUrl}/editar/${id}`, veterinario);
  }

  desactivar(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/desactivar/${id}`);
  }

  activar(id: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/activar/${id}`, {});
  }
}
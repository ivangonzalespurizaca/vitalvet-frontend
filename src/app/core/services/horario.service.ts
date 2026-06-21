import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { HorarioResponse } from '../interfaces/horario';
import { HorarioRequest } from '../interfaces/horario';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private http = inject(HttpClient);
  // Asumiendo que usas el puerto 8091 configurado en environment.ts
  private apiUrl = `${environment.gatewayUrl}/api/agenda/horario`;

  // Obtener horarios de un veterinario específico
  obtenerPorVeterinario(id: number): Observable<ApiResponse<HorarioResponse>> {
    return this.http.get<ApiResponse<HorarioResponse>>(`${this.apiUrl}/veterinario/${id}`);
  }

  // Registrar un nuevo horario
  registrarHorario(horario: HorarioRequest): Observable<ApiResponse<any>> {
      return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, horario);
  }

  // Eliminar un horario
  eliminarHorario(idHorario: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${idHorario}`);
  }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { MascotaResponseDTO } from '../interfaces/mascota-response';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.restUrl}/api/paciente/mascota`;

  listarMisMascotas(): Observable<ApiResponse<MascotaResponseDTO[]>> {
    return this.http.get<ApiResponse<MascotaResponseDTO[]>>(`${this.apiUrl}/mis-mascotas`);
  }

  listarPorCliente(idCliente: number): Observable<ApiResponse<MascotaResponseDTO[]>> {
    return this.http.get<ApiResponse<MascotaResponseDTO[]>>(`${this.apiUrl}/cliente/${idCliente}`);
  }

  registrarMascota(data: any): Observable<ApiResponse<MascotaResponseDTO>> {
    return this.http.post<ApiResponse<MascotaResponseDTO>>(`${this.apiUrl}/registrar`, data);
  }

  editarMascota(id: number, data: any): Observable<ApiResponse<MascotaResponseDTO>> {
    return this.http.put<ApiResponse<MascotaResponseDTO>>(`${this.apiUrl}/editar/${id}`, data);
  }

  obtenerPorId(idMascota: number): Observable<ApiResponse<MascotaResponseDTO>> {
    return this.http.get<ApiResponse<MascotaResponseDTO>>(`${this.apiUrl}/${idMascota}`);
  }
}

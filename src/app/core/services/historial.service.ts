import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { HistorialClinicoResponseDTO } from '../interfaces/historial';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.restUrl}/api/paciente/historial-clinico`;

  obtenerHistorialPorMascota(idMascota: number): Observable<ApiResponse<HistorialClinicoResponseDTO>> {
    return this.http.get<ApiResponse<HistorialClinicoResponseDTO>>(`${this.apiUrl}/mascota/${idMascota}`);
  }
}

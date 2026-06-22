import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { MascotasResponse } from '../interfaces/mascota-response'; // Asegúrate de tener este import
import { CarnetVacunaDTO, VacunaRegistroRequestDTO } from '../interfaces/vacuna-gestion';

@Injectable({
  providedIn: 'root'
})
export class VacunacionService {
  private http = inject(HttpClient);
  // URL base específica para este controlador
  private apiUrl = `${environment.restUrl}/api/paciente/gestion-vacunas`;

  constructor() { }

  buscarPanelPorDni(dni: string): Observable<MascotasResponse> {
    return this.http.get<ApiResponse<MascotasResponse>>(`${this.apiUrl}/propietario/dni/${dni}`)
      .pipe(
        map(res => res.data) // Extraemos el objeto MascotasResponse de la respuesta
      );
  }

  obtenerCarnet(idMascota: number, estado: string = 'TODAS'): Observable<ApiResponse<CarnetVacunaDTO>> {
    return this.http.get<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/mascota/${idMascota}/carnet`, {
      params: { estado }
    });
  }

  // POST: Registrar vacuna manualmente
  registrarVacunaManual(idMascota: number, data: VacunaRegistroRequestDTO): Observable<ApiResponse<CarnetVacunaDTO>> {
    return this.http.post<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/mascota/${idMascota}/registrar-manual`, data);
  }

  // PUT: Confirmar aplicación de una vacuna programada
  confirmarAplicacion(idAplicacion: number, idConsulta?: number): Observable<ApiResponse<CarnetVacunaDTO>> {
    const params: any = {};
    if (idConsulta) params['idConsulta'] = idConsulta;
    
    return this.http.put<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/vacuna-aplicada/${idAplicacion}/confirmar`, null, { params });
  }
}
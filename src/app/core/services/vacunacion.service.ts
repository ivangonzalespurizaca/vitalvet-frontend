import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { MascotasResponse } from '../interfaces/mascota-response';
import { CarnetVacunaDTO, VacunaRegistroRequestDTO } from '../interfaces/vacuna-gestion';

@Injectable({
  providedIn: 'root'
})
export class VacunacionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.restUrl}/api/paciente/gestion-vacunas`;

  constructor() { }

  buscarPanelPorDni(dni: string): Observable<MascotasResponse> {
    return this.http.get<ApiResponse<MascotasResponse>>(`${this.apiUrl}/propietario/dni/${dni}`)
      .pipe(
        map(res => res.data)
      );
  }


  obtenerCarnetPorMascota(idMascota: number, estado: string = 'TODAS'): Observable<ApiResponse<CarnetVacunaDTO>> {
    return this.http.get<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/mascota/${idMascota}/carnet?estado=${estado}`);
  }


  obtenerCarnet(idMascota: number, estado: string = 'TODAS'): Observable<ApiResponse<CarnetVacunaDTO>> {
    return this.http.get<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/mascota/${idMascota}/carnet`, {
      params: { estado }
    });
  }


  registrarVacunaManual(idMascota: number, data: VacunaRegistroRequestDTO): Observable<ApiResponse<CarnetVacunaDTO>> {
    return this.http.post<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/mascota/${idMascota}/registrar-manual`, data);
  }


  confirmarAplicacion(idAplicacion: number, idConsulta?: number): Observable<ApiResponse<CarnetVacunaDTO>> {
    const params: any = {};
    if (idConsulta) params['idConsulta'] = idConsulta;

    return this.http.put<ApiResponse<CarnetVacunaDTO>>(`${this.apiUrl}/vacuna-aplicada/${idAplicacion}/confirmar`, null, { params });
  }
}

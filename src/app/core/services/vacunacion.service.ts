import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { MascotasResponse } from '../interfaces/mascota-response'; // Asegúrate de tener este import

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
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { ConsultaRequestDTO } from '../interfaces/consulta';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private apiUrl = `${environment.restUrl}/api/paciente`;

  constructor(private http: HttpClient) {}

  registrarConsulta(idMascota: number, data: ConsultaRequestDTO): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/consulta/mascota/${idMascota}/registrar`,
      data
    );
  }
}

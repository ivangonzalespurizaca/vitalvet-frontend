import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { ConsultaRequestDTO } from '../interfaces/consulta';
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.restUrl}/api/paciente/consulta`;

  registrarConsulta(idMascota: number, data: ConsultaRequestDTO): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/mascota/${idMascota}/registrar`,
      data
    );
  }
}

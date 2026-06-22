import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { VacunaDTO } from '../interfaces/vacuna';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VacunaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.restUrl}/api/paciente/vacuna`;

  listarActivas(): Observable<ApiResponse<VacunaDTO[]>> {
    return this.http.get<ApiResponse<VacunaDTO[]>>(`${this.apiUrl}/listar-activos`);
  }
}
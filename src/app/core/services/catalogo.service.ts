// src/app/core/services/catalogo.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Especie, Raza } from '../interfaces/catalogos';
import { ApiResponse } from '../interfaces/api-response'; // Si no la tienes, créala (la explicamos antes)
import { environment } from '../../../environments/environment';
import { Especialidad } from '../interfaces/catalogos';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.restUrl}/api/paciente`; 
  private api2Url = `${environment.gatewayUrl}/api/usuario`;

  obtenerEspeciesActivas(): Observable<ApiResponse<Especie[]>> {
    return this.http.get<ApiResponse<Especie[]>>(`${this.apiUrl}/especie/listar-activos`);
  }

  obtenerTodasLasRazasActivas(): Observable<ApiResponse<Raza[]>> {
    return this.http.get<ApiResponse<Raza[]>>(`${this.apiUrl}/raza/listar-activos`);
  }

  obtenerEspecialidadesActivas(): Observable<ApiResponse<Especialidad[]>> {
    return this.http.get<ApiResponse<Especialidad[]>>(`${this.api2Url}/especialidad/listar-activos`);
  }
}
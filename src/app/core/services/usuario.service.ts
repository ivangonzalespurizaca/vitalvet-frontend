import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilRequest } from '../interfaces/perfil-request';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.gatewayUrl}/api/usuario`; // Puerto de tu microservicio

  actualizarPerfil(data: PerfilRequest): Observable<ApiResponse<{ perfil: any, token: string }>> {
    return this.http.put<ApiResponse<{ perfil: any, token: string }>>(`${this.apiUrl}/actualizar`, data);
  }


}

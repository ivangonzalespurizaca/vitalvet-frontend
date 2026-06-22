import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';
import { ClienteDashboard, VeterinarioDashboardDTO } from '../interfaces/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  // Apunta siempre al Gateway (8091 según tu configuración anterior)
  private apiUrl = `${environment.gatewayUrl}/api/agenda/dashboard`;

  obtenerDashboardCliente(): Observable<ApiResponse<ClienteDashboard>> {
    return this.http.get<ApiResponse<ClienteDashboard>>(`${this.apiUrl}/cliente`);
  }

  getAdminDashboard(): Observable<any> { // ApiResponse<AdminDashboardDTO>
    return this.http.get<any>(`${this.apiUrl}/admin`);
  }

  getVeterinarioDashboard(): Observable<VeterinarioDashboardDTO> {
    return this.http.get<VeterinarioDashboardDTO>(`${this.apiUrl}/veterinario`);
  }
}
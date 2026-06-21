import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.gatewayUrl}/api/media/perfil/upload`;

  subirFoto(archivo: File): Observable<ApiResponse<{urlFoto: string}>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return this.http.post<ApiResponse<{urlFoto: string}>>(this.apiUrl, formData);
  }
}
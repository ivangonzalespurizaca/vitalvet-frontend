import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminLogsService {

  private apiUrl = 'http://localhost:8095/api/v1/logs';

  constructor(private http: HttpClient) { }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  buscar(filtros: any): Observable<any[]> {

    let params = new HttpParams();

    if (filtros.usuarioOrId) {
      params = params.set('usuarioOrId', filtros.usuarioOrId);
    }

    if (filtros.modulo) {
      params = params.set('modulo', filtros.modulo);
    }

    if (filtros.accion) {
      params = params.set('accion', filtros.accion);
    }

    if (filtros.fecha) {
      params = params.set('fecha', filtros.fecha);
    }

    return this.http.get<any[]>(
      `${this.apiUrl}/buscar`,
      { params }
    );
  }
}
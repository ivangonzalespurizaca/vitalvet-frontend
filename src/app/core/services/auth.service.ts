import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../../features/auth/interfaces/login-request';
import { RegistroWebDTO } from '../../features/auth/interfaces/registro-request';
import { environment } from '../../../environments/environment';

export interface CustomJwtPayload {
  sub: string;        
  idUsuario: number;
  email: string;
  idPersona: number;
  nombres: string;
  apellidos: string;
  dni: string;
  celular: string;
  genero: string;
  fotoUrl?: string;
  rol: 'ADMINISTRADOR' | 'VETERINARIO' | 'CLIENTE';
  
  numColegiatura?: string;
  idVeterinario?: number;
  especialidad?: string;
  
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.gatewayUrl}/api/usuario/auth`; 

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.success && response.data?.token) {
          const tokenString = response.data.token;
          localStorage.setItem('token', tokenString);
          
          // 1. Extraemos TODOS los claims del Token (incluidos numColegiatura y especialidad)
          const payloadDecodificado = jwtDecode<CustomJwtPayload>(tokenString);
          
          // 2. SERIALIZAMOS el payload completo extraído para guardarlo como string
          localStorage.setItem('user_profile', JSON.stringify(payloadDecodificado));
        }
      })
    );
  }

  registrar(datos: RegistroWebDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar/web`, datos);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserProfile(): CustomJwtPayload | null {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }

  // En tu AuthService
  getIdPersona(): number | null {
    const profile = this.getUserProfile();
    // Retornamos idPersona si existe, de lo contrario null
    return profile ? profile.idPersona : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
  }

  recuperarPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-password`, { email });
  }

  cambiarPassword(token: string, nuevaContrasenia: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-password`, { token, nuevaContrasenia });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const profile = this.getUserProfile();

    if (!token || !profile) {
      return false;
    }

    const tokenExpiro = (profile.exp * 1000) < Date.now();
    
    if (tokenExpiro) {
      this.logout();
      return false;
    }

    return true;
  }

  getUserRole(): string | undefined {
    const profile = this.getUserProfile();
    return profile?.rol;
  }

  setToken(token: string): void {
    // 1. Guardamos el string del token
    localStorage.setItem('token', token); 
    
    // 2. Decodificamos el token a un objeto JSON
    const payloadDecodificado = jwtDecode<CustomJwtPayload>(token);
    
    // 3. Guardamos el objeto convertido a String JSON en user_profile
    localStorage.setItem('user_profile', JSON.stringify(payloadDecodificado));
  }
}
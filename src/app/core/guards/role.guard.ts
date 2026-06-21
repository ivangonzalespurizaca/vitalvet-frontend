import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Si no hay sesión, al login (aquí sí es necesario)
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getUserRole();
  const expectedRoles = route.data['roles'] as Array<string>;

  // 2. Si la ruta no tiene roles restringidos (pública), dejamos pasar
  if (!expectedRoles) return true;

  // 3. Si el rol es correcto, dejamos pasar
  if (expectedRoles.includes(userRole!)) return true;

  // 4. ACCESO DENEGADO: El usuario está logueado pero intenta entrar donde no debe.
  // Solo redirigimos si NO está ya en su propio dashboard para evitar bucles.
  const dashboardMap: Record<string, string> = {
    'ADMINISTRADOR': '/admin/dashboard',
    'VETERINARIO': '/veterinario/dashboard',
    'CLIENTE': '/cliente/dashboard'
  };

  const dashboardPath = dashboardMap[userRole!] || '/login';
  
  // Evitar navegación si ya está en la ruta destino
  if (state.url !== dashboardPath) {
    alert('Acceso denegado: No tienes permisos para ver esta página.');
    router.navigate([dashboardPath]);
  }
  
  return false;
};
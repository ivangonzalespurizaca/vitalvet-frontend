import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: `<p>Redireccionando a tu panel...</p>`
})
export class DashboardRedirectComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const perfil = this.authService.getUserProfile();

    if (!perfil) {
      this.router.navigate(['/login']);
      return;
    }

    switch (perfil.rol) {
      case 'ADMINISTRADOR':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'VETERINARIO':
        this.router.navigate(['/veterinario/dashboard']);
        break;
      case 'CLIENTE':
        this.router.navigate(['/cliente/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
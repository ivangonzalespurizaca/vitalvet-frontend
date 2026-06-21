import { Component, inject, OnInit, Input } from '@angular/core'; // 1. Importa Input
import { Router, RouterModule } from '@angular/router';
import { AuthService, CustomJwtPayload } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() titulo: string = 'VITAL VET';
  private authService = inject(AuthService);
  private router = inject(Router);
  
  usuario: CustomJwtPayload | null = null;

  ngOnInit() {
    this.usuario = this.authService.getUserProfile();
  }

  get iniciales(): string {
    if (!this.usuario) return '';
    return (this.usuario.nombres[0] + this.usuario.apellidos[0]).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
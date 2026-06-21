import { Component, inject, OnInit } from '@angular/core';
import { AuthService, CustomJwtPayload } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  perfil: CustomJwtPayload | null = null;

  ngOnInit(): void {
    this.perfil = this.authService.getUserProfile();
  }

  onLogout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
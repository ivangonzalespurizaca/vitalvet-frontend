import { Component, inject, OnInit } from '@angular/core';
import { AuthService, CustomJwtPayload } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  
  perfil: CustomJwtPayload | null = null;

  ngOnInit(): void {
    this.perfil = this.authService.getUserProfile ? this.authService.getUserProfile() : this.authService.getUserProfile();
  }

  onLogout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
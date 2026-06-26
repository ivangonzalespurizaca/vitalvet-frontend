import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { AdminDashboardDTO } from '../../../../core/interfaces/dashboard';
import { AuthService, CustomJwtPayload } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService)
  private dashboardService = inject(DashboardService);

  usuario: CustomJwtPayload | null = null;
  datos: AdminDashboardDTO | null = null;
  cargando = true;

  ngOnInit(): void {
    this.dashboardService.getAdminDashboard().subscribe({
      next: (response) => {
        this.usuario = this.authService.getUserProfile();
        this.datos = response.data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard admin', err);
        this.cargando = false;
      }
    });
  }
}
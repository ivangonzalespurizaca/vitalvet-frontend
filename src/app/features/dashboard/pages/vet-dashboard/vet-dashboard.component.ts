import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { VeterinarioDashboardDTO } from '../../../../core/interfaces/dashboard';
import { AuthService, CustomJwtPayload } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-vet-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vet-dashboard.component.html',
  styleUrls: ['./vet-dashboard.component.css']
})
export class VetDashboardComponent implements OnInit {
  private authService = inject(AuthService)
  private dashboardService = inject(DashboardService);
  
  usuario: CustomJwtPayload | null = null;
  datos: VeterinarioDashboardDTO | null = null;
  cargando = true;

  ngOnInit(): void {
    this.dashboardService.getVeterinarioDashboard().subscribe({
      next: (data) => {
        this.usuario = this.authService.getUserProfile();
        this.datos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard veterinario', err);
        this.cargando = false;
      }
    });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteDashboard } from '../../../../core/interfaces/dashboard';
import { DashboardService } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  datos: ClienteDashboard | null = null;
  cargando: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.dashboardService.obtenerDashboardCliente().subscribe({
      next: (response) => {
        if (response.success) {
          this.datos = response.data;
        }
        this.cargando = false;
      },
      error: (err) => {
        this.error = "No se pudieron cargar los datos del panel.";
        this.cargando = false;
      }
    });
  }
}
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VacunacionService } from '../../../../core/services/vacunacion.service';
import { CarnetVacunaDTO } from '../../../../core/interfaces/carnet';

@Component({
  selector: 'app-carnet-vacunas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carnet-vacunas.component.html'
})
export class CarnetVacunasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vacunacionService = inject(VacunacionService);

  idMascota!: number;
  carnet = signal<CarnetVacunaDTO | null>(null);
  cargando = signal<boolean>(true);

  // Filtros reactivos
  filtroEstado = signal<string>('TODAS');
  terminoBusqueda = signal<string>('');

  ngOnInit(): void {
    this.idMascota = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idMascota) {
      this.cargarCarnet();
    } else {
      this.router.navigate(['/cliente/mis-mascotas']);
    }
  }

  cargarCarnet(): void {
    this.cargando.set(true);
    this.vacunacionService.obtenerCarnetPorMascota(this.idMascota, 'TODAS').subscribe({
      next: (res) => {
        if (res.success) {
          this.carnet.set(res.data);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      }
    });
  }

  // Filtrado combinado eficiente en memoria
  vacunasFiltradas = computed(() => {
    const infoCarnet = this.carnet();
    if (!infoCarnet) return [];

    return infoCarnet.vacunas.filter(v => {
      const cumpleEstado = this.filtroEstado() === 'TODAS' || v.estado.toUpperCase() === this.filtroEstado().toUpperCase();
      const cumpleTexto = v.nombreVacuna.toLowerCase().includes(this.terminoBusqueda().toLowerCase());
      return cumpleEstado && cumpleTexto;
    });
  });

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }

  manejarErrorImagen(): void {
    const datos = this.carnet();
    if (datos) {
      datos.fotoUrl = 'assets/images/default-pet.png';
      this.carnet.set({ ...datos });
    }
  }
}

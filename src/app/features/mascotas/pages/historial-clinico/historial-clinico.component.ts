import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HistorialService } from '../../../../core/services/historial.service';
import { HistorialClinicoResponseDTO } from '../../../../core/interfaces/historial';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial-clinico.component.html',
  styleUrls: ['./historial-clinico.component.css']
})
export class HistorialClinicoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private historialService = inject(HistorialService);

  idMascota!: number;
  historial = signal<HistorialClinicoResponseDTO | null>(null);
  cargando = signal<boolean>(true);

  // Filtros reactivos
  filtroTipo = signal<string>('TODAS');
  terminoFiltrado = signal<string>('');

  ngOnInit(): void {
    this.idMascota = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idMascota) {
      this.cargarHistorial();
    } else {
      this.router.navigate(['/cliente/mis-mascotas']);
    }
  }

  cargarHistorial(): void {
    this.cargando.set(true);
    this.historialService.obtenerHistorialPorMascota(this.idMascota).subscribe({
      next: (res) => {
        if (res.success) {
          this.historial.set(res.data);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      }
    });
  }

  eventosFiltrados = computed(() => {
    const data = this.historial();
    if (!data) return [];

    return data.eventos.filter(e => {
      const cumpleTipo = this.filtroTipo() === 'TODAS' ||
        (this.filtroTipo() === 'CONSULTAS' && e.tipo === 'CONSULTA MÉDICA') ||
        (this.filtroTipo() === 'INMUNIZACIONES' && e.tipo === 'INMUNIZACIÓN');

      const cumpleTexto = this.terminoFiltrado() === '' ||
        e.atendidoPor.toLowerCase().includes(this.terminoFiltrado().toLowerCase()) ||
        (e.diagnosticoClinico && e.diagnosticoClinico.toLowerCase().includes(this.terminoFiltrado().toLowerCase())) ||
        (e.nombreVacuna && e.nombreVacuna.toLowerCase().includes(this.terminoFiltrado().toLowerCase()));

      return cumpleTipo && cumpleTexto;
    });
  });

  onFiltrarTexto(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.terminoFiltrado.set(input.value);
  }

  onCambiarTipo(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroTipo.set(select.value);
  }

  manejarErrorImagen(): void {
    const data = this.historial();
    if (data) {
      data.fotoUrl = 'assets/images/default-pet.png';
      this.historial.set({ ...data });
    }
  }
}

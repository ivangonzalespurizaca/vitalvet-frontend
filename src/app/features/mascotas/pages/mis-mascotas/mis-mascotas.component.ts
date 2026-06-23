import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../../core/services/mascota.service';
import { VacunacionService } from '../../../../core/services/vacunacion.service';
import { MascotaResponseDTO } from '../../../../core/interfaces/mascota-response';
import { CarnetVacunaDTO } from '../../../../core/interfaces/carnet';
import { MascotaModalComponent } from '../../../dashboard/components/mascota-modal.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-mis-mascotas',
  standalone: true,
  imports: [CommonModule, MascotaModalComponent, RouterLink],
  templateUrl: './mis-mascotas.component.html',
  styleUrls: ['./mis-mascotas.component.css']
})
export class MisMascotasComponent implements OnInit {
  private mascotaService = inject(MascotaService);
  private vacunacionService = inject(VacunacionService);

  // Estados del listado principal
  mascotas: MascotaResponseDTO[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  // Estados para el Modal del Carnet de Vacunación
  mostrarModalCarnet: boolean = false;
  carnetSeleccionado: CarnetVacunaDTO | null = null;
  cargandoCarnet: boolean = false;

  // Estados reactivos (Signals) para el Modal de Formulario (Registro/Edición)
  mostrarModalFormulario = signal<boolean>(false);
  idMascotaSeleccionada = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargando = true;
    this.mascotaService.listarMisMascotas().subscribe({
      next: (res) => {
        if (res.success) {
          this.mascotas = res.data;
        } else {
          this.errorMensaje = res.mensaje || 'No se pudieron cargar las mascotas.';
        }
        this.cargando = false;
      },
      error: (err) => {
        this.errorMensaje = 'Error de conexión con el servidor.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  // Manejador seguro para evitar bucles infinitos de renderizado
  manejarErrorImagen(mascota: any): void {
    if (mascota && !mascota.fotoUrl?.startsWith('data:image') && mascota.fotoUrl !== 'assets/images/default-pet.png') {
      mascota.fotoUrl = 'assets/images/default-pet.png';
    }
  }

  verCarnet(idMascota: number): void {
    this.cargandoCarnet = true;
    this.mostrarModalCarnet = true;
    this.carnetSeleccionado = null;

    this.vacunacionService.obtenerCarnetPorMascota(idMascota, 'TODAS').subscribe({
      next: (res) => {
        if (res.success) {
          this.carnetSeleccionado = res.data;
        }
        this.cargandoCarnet = false;
      },
      error: (err) => {
        this.cargandoCarnet = false;
        console.error('Error al obtener el carnet:', err);
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModalCarnet = false;
    this.carnetSeleccionado = null;
  }

  abrirFormularioRegistro(): void {
    this.idMascotaSeleccionada.set(null);
    this.mostrarModalFormulario.set(true);
  }

  abrirFormularioEdicion(idMascota: number): void {
    this.idMascotaSeleccionada.set(idMascota);
    this.mostrarModalFormulario.set(true);
  }
}

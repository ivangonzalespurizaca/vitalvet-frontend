import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterModule } from '@angular/router';
import { VeterinarioService } from '../../../../core/services/veterinario.service';
import { VeterinarioResponse } from '../../../../core/interfaces/veterinario-response';
import { VeterinarioModalComponent } from '../veterinario-modal/veterinario-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-veterinarios-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, VeterinarioModalComponent, RouterModule],
  templateUrl: './veterinarios-list.component.html',
  styleUrls: ['./veterinarios-list.component.css']
})
export class VeterinariosListComponent implements OnInit {
  private vService = inject(VeterinarioService);
  private swalToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});


  
  mostrarModal = false;
  veterinarioIdSeleccionado: number | null = null;
  
  veterinarios: VeterinarioResponse[] = [];
  cargando = false;
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.cargarVeterinarios();
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(criterio => this.cargarVeterinarios(criterio || ''));
  }

  cargarVeterinarios(criterio: string = ''): void {
    this.cargando = true;
    this.vService.listarVeterinarios(criterio).subscribe({
      next: (res) => { if (res.success) this.veterinarios = res.data; },
      complete: () => (this.cargando = false)
    });
  }
  abrirModalRegistro() {
    this.veterinarioIdSeleccionado = null; // null = Nuevo registro
    this.mostrarModal = true;
  }

  abrirModalEdicion(id: number) {
    this.veterinarioIdSeleccionado = id; // ID real = Editar
    this.mostrarModal = true;
  }
  async cambiarEstado(vet: VeterinarioResponse) {

  const accion = vet.activo ? 'desactivar' : 'activar';

  const result = await Swal.fire({
    title: `¿${vet.activo ? 'Desactivar' : 'Activar'} veterinario?`,
    text: `Se ${accion}á a ${vet.nombres} ${vet.apellidos}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f766e',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  const request$ = vet.activo
    ? this.vService.desactivar(vet.idVeterinario)
    : this.vService.activar(vet.idVeterinario);

  request$.subscribe({
    next: (res) => {

      this.swalToast.fire({
        icon: 'success',
        title: res.mensaje || `Veterinario ${accion}do correctamente.`
      });

      this.cargarVeterinarios();
    },

    error: (err) => {

      this.swalToast.fire({
        icon: 'error',
        title: err.error?.mensaje || `Error al ${accion} veterinario.`
      });

    }
  });

}

  obtenerIniciales(vet: VeterinarioResponse): string {
  const nombre = vet.nombres?.trim() || '';
  const apellido = vet.apellidos?.trim() || '';

  const inicialNombre = nombre.charAt(0).toUpperCase();
  const inicialApellido = apellido.charAt(0).toUpperCase();

  return `${inicialNombre}${inicialApellido}`;
}

  onOperacionExitosa() {
    this.mostrarModal = false;
    this.cargarVeterinarios(); // Refresca la lista
  }
}
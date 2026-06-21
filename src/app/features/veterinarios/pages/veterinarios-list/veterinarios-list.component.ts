import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RouterModule } from '@angular/router';
import { VeterinarioService } from '../../../../core/services/veterinario.service';
import { VeterinarioResponse } from '../../../../core/interfaces/veterinario-response';
import { VeterinarioModalComponent } from '../veterinario-modal/veterinario-modal.component';

@Component({
  selector: 'app-veterinarios-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, VeterinarioModalComponent, RouterModule],
  templateUrl: './veterinarios-list.component.html',
  styleUrls: ['./veterinarios-list.component.css']
})
export class VeterinariosListComponent implements OnInit {
  private vService = inject(VeterinarioService);
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

  cambiarEstado(vet: any) {
    const accion = vet.activo ? 'desactivar' : 'activar';
    const confirmacion = confirm(`¿Estás seguro que deseas ${accion} al veterinario ${vet.nombres}?`);
    
    if (!confirmacion) return;

    const request$ = vet.activo 
      ? this.vService.desactivar(vet.idVeterinario) 
      : this.vService.activar(vet.idVeterinario);

    request$.subscribe({
      next: () => {
        alert(`Veterinario ${accion}do correctamente.`);
        this.cargarVeterinarios(); // Recarga la lista para ver el cambio
      },
      error: (err) => {
        alert(err.error?.mensaje || `Error al ${accion} veterinario`);
      }
    });
  }

  onOperacionExitosa() {
    this.mostrarModal = false;
    this.cargarVeterinarios(); // Refresca la lista
  }
}
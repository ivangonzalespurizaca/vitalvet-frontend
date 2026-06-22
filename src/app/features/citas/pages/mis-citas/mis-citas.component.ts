import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CitaService } from '../../../../core/services/cita.service';
import { CitaPanelResponse, CitaDetalleResponse } from '../../../../core/interfaces/cita';

@Component({
  selector: 'app-mis-citas', // Mantenemos el nombre original
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css'
})
export class MisCitasComponent implements OnInit {
  private citaService = inject(CitaService);

  citas: CitaPanelResponse[] = [];
  searchControl = new FormControl('');
  estadoFiltro: string = '';
  detalleSeleccionado: CitaDetalleResponse | null = null;
  mostrarModalDetalle = false;

  ngOnInit(): void {
    this.cargarCitas();
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.cargarCitas());
  }

  cargarCitas(): void {
    const busqueda = this.searchControl.value || '';
    this.citaService.obtenerPanelCitas(this.estadoFiltro || undefined, busqueda).subscribe({
      next: (res) => { if (res.success) this.citas = res.data; }
    });
  }

  verDetalle(idCita: number) {
    this.citaService.obtenerDetalleCita(idCita).subscribe({
      next: (res) => {
        this.detalleSeleccionado = res.data;
        this.mostrarModalDetalle = true;
      },
      error: (err) => alert('No se pudo cargar el detalle: ' + err.message)
    });
  }

  cerrarDetalle() {
    this.mostrarModalDetalle = false;
    this.detalleSeleccionado = null;
  }

    filtrarPorEstado(estado: string): void {
    this.estadoFiltro = estado;
    this.cargarCitas();
  }
}
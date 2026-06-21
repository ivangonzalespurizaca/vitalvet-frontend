import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CitaService } from '../../../../core/services/cita.service';
import { CitaPanelResponse, CitaDetalleResponse } from '../../../../core/interfaces/cita';

@Component({
  selector: 'app-citas-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './citas-list.component.html',
  styleUrls: ['./citas-list.component.css']
})
export class CitasListComponent implements OnInit {
  private citaService = inject(CitaService);

  citas: CitaPanelResponse[] = [];
  searchControl = new FormControl('');
  estadoFiltro: string = ''; // '' = Todas, 'PAGADO', 'PENDIENTE'
  detalleSeleccionado: CitaDetalleResponse | null = null;
  mostrarModalDetalle = false;

  ngOnInit(): void {
    this.cargarCitas();
    
    // Escuchar cambios en la búsqueda con debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.cargarCitas());
  }

cargarCitas(): void {
  const busqueda = this.searchControl.value || '';
  this.citaService.obtenerPanelCitas(this.estadoFiltro || undefined, busqueda).subscribe({
    next: (res) => {
      if (res.success) {
        this.citas = res.data;
        console.log('Estructura de la primera cita:', this.citas[0]); // <--- MIRA ESTO EN F12
      }
    }
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
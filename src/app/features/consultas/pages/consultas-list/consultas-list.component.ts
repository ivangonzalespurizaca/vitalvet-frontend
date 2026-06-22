import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // <-- Importa esto
import { CitaService } from '../../../../core/services/cita.service';
import { CitaPanelResponse, CitaDetalleResponse } from '../../../../core/interfaces/cita';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- Añade ReactiveFormsModule
  templateUrl: './consultas-list.component.html',
  styleUrls: ['./consultas-list.component.css']
})
export class ConsultasListComponent implements OnInit {
  private citaService = inject(CitaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  detalleSeleccionado: CitaDetalleResponse | null = null; 
  mostrarModalDetalle = false;
  
  citas: CitaPanelResponse[] = [];
  estadoActual: string = '';
  busquedaForm: FormGroup;

  constructor() {
    this.busquedaForm = this.fb.group({
      criterio: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(estado?: string) {
    if (estado !== undefined) this.estadoActual = estado;
    
    const criterio = this.busquedaForm.get('criterio')?.value;

    this.citaService.obtenerPanelCitas(this.estadoActual, criterio).subscribe({
      next: (res) => this.citas = res.data,
      error: () => alert('Error al cargar consultas')
    });
  }
  atenderCita(c: CitaPanelResponse) {
    // Asegúrate de que c.idMascota exista.
    // Si no está, tendrás que obtenerlo (ej. c.mascota.id)
    const idMascota = c.idMascota; 
    
    this.router.navigate(['/veterinario/consultas/registrar', idMascota], {
      queryParams: { 
        idCita: c.idCita,
        mascota: c.nombreMascota, 
        motivo: c.motivo          
      }
    });
  }

  verFicha(idCita: number) {
    // Asumiendo que tienes un método en tu servicio para traer el detalle de la consulta
    this.citaService.obtenerDetalleCita(idCita).subscribe({
      next: (res) => {
        this.detalleSeleccionado = res.data;
        this.mostrarModalDetalle = true;
      },
      error: () => alert('No se pudo cargar el detalle de la consulta')
    });
  }

  cerrarDetalle() {
    this.mostrarModalDetalle = false;
    this.detalleSeleccionado = null;
  }

  // Métodos de navegación igual que antes...
}


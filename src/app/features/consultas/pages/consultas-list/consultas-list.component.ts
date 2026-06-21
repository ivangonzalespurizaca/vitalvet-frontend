import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // <-- Importa esto
import { CitaService } from '../../../../core/services/cita.service';
import { CitaPanelResponse } from '../../../../core/interfaces/cita';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- Añade ReactiveFormsModule
  templateUrl: './consultas-list.component.html',
  styleUrls: ['./consultas-list.component.css']
})
export class ConsultasListComponent implements OnInit {
  private citaService = inject(CitaService);
  private fb = inject(FormBuilder);
  
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
  atenderCita(id: number) {
    console.log('Atendiendo cita:', id);
    // Aquí irá tu lógica de navegación
  }

  verFicha(id: number) {
    console.log('Ver ficha:', id);
    // Aquí irá tu lógica de visualización
  }

  // Métodos de navegación igual que antes...
}
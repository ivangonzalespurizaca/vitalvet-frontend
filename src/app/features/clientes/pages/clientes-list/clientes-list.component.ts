import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ClienteResponse } from '../../../../core/interfaces/cliente-response';
import { ClienteModalComponent } from '../../components/cliente-modal/cliente-modal.component';
import { MascotasListModalComponent } from '../../components/mascotas-list-modal/mascotas-list-modal.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClienteModalComponent, MascotasListModalComponent],
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {
  private clienteService = inject(ClienteService);

  clientes: ClienteResponse[] = [];
  cargando = false;
  
  // Control Cliente
  mostrarModalCliente = false;
  clienteSeleccionadoId: number | null = null;
  
  // Control Mascotas
  mostrarMascotasModal = false;
  clienteSeleccionadoParaMascotas: ClienteResponse | null = null;
  
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.cargarClientes();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(criterio => {
      this.cargarClientes(criterio || '');
    });
  }

  cargarClientes(criterio: string = ''): void {
    this.cargando = true;
    this.clienteService.listarClientes(criterio).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clientes = response.data;
        }
      },
      error: (err) => console.error('Error al cargar clientes:', err),
      complete: () => this.cargando = false
    });
  }

  // --- GESTIÓN CLIENTES ---
  abrirModalRegistro() {
    this.clienteSeleccionadoId = null; 
    this.mostrarModalCliente = true;
  }

  abrirModalEdicion(idPersona: number) {
    this.clienteSeleccionadoId = idPersona; 
    this.mostrarModalCliente = true;
  }

  cerrarModal() {
    this.mostrarModalCliente = false;
    this.clienteSeleccionadoId = null;
  }

  onOperacionExitosa() {
    this.cerrarModal();
    this.cargarClientes(); 
  }

  // --- GESTIÓN MASCOTAS ---
  abrirModalMascotas(cliente: ClienteResponse) {
    this.clienteSeleccionadoParaMascotas = cliente;
    this.mostrarMascotasModal = true;
  }

  cerrarModalMascotas() {
    this.mostrarMascotasModal = false;
    this.clienteSeleccionadoParaMascotas = null;
  }
}
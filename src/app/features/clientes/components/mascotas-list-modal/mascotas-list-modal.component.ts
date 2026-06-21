import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../../core/services/mascota.service';
import { MascotaResponseDTO } from '../../../../core/interfaces/mascota-response';

@Component({
  selector: 'app-mascotas-lista-modal',
  standalone: true,
  templateUrl: './mascotas-list-modal.component.html',
  styleUrls: ['./mascotas-list-modal.component.css']
})
export class MascotasListModalComponent implements OnInit {
  private mascotaService = inject(MascotaService);

  @Input() idCliente!: number;
  @Input() nombrePropietario!: string;
  @Input() dniPropietario!: string;
  @Output() cerrar = new EventEmitter<void>();

  mascotas: MascotaResponseDTO[] = [];
  cargando = false;

  // Variables para el modal hijo (Formulario)
  mostrarFormulario = false;

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.cargando = true;
    this.mascotaService.listarPorCliente(this.idCliente).subscribe({
      next: (res) => {
        if (res.success) this.mascotas = res.data;
      },
      complete: () => this.cargando = false
    });
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.cargarMascotas(); // Refresca la lista al volver
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaBloqueResponseDTO } from '../../../../core/interfaces/agenda';
import { HorarioService } from '../../../../core/services/horario.service';
import { Router } from '@angular/router';
import { CitaDetalleResponse } from '../../../../core/interfaces/cita';
import { CitaService } from '../../../../core/services/cita.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  private citaService = inject(CitaService);
  private agendaService = inject(HorarioService);
  private router = inject(Router);
  detalleSeleccionado: CitaDetalleResponse | null = null;
  mostrarModalDetalle = false;

  bloques: AgendaBloqueResponseDTO[] = [];
  fechaSeleccionada: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.cargarAgenda();
  }

  cargarAgenda() {
    this.agendaService.obtenerAgenda(this.fechaSeleccionada).subscribe(res => {
      this.bloques = res.data;
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


  realizarConsulta(bloque: AgendaBloqueResponseDTO) {

    if (!bloque.idCita) {
      return;
    }

    this.router.navigate(
      ['/veterinario/consultas/registrar', 1], // o el idVeterinario real
      {
        queryParams: {
          idCita: bloque.idCita,
          mascota: bloque.nombreMascota,
          motivo: bloque.motivoConsulta
        }
      }
    );

  }
}
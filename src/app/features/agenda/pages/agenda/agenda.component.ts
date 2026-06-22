import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaBloqueResponseDTO } from '../../../../core/interfaces/agenda';
import { HorarioService } from '../../../../core/services/horario.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  private agendaService = inject(HorarioService);
  
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
}
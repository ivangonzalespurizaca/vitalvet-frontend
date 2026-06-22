import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacunaService } from '../../../../core/services/vacuna.service'; // Para el catálogo
import { MascotasResponse, CarnetVacunaDTO} from '../../../../core/interfaces/vacuna-gestion';
import { VacunacionService } from '../../../../core/services/vacunacion.service';
import { VacunaDTO } from '../../../../core/interfaces/vacuna';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacunacion.component.html',
  styleUrls: ['./vacunacion.component.css']
})
export class VacunacionComponent implements OnInit {
  private sv = inject(VacunacionService);
  private vs = inject(VacunaService); // Catálogo de vacunas

  dni = '';
  resultado: MascotasResponse | null = null;
  carnet: CarnetVacunaDTO | null = null;
  idMascotaSeleccionada: number | null = null;
  
  // Catálogos para el formulario
  catalogoVacunas: VacunaDTO[] = [];
  
  // Modelo del formulario
  nuevaVacuna = { idVacuna: null, dosisTipo: '', fecha: '' };

  ngOnInit() {
    this.vs.listarActivas().subscribe(res => this.catalogoVacunas = res.data);
  }

buscar() {
  if (!this.dni.trim()) return;

  this.sv.buscarPanelPorDni(this.dni).subscribe({
    next: (data: MascotasResponse) => { 
      this.resultado = data;
      this.carnet = null;
      this.idMascotaSeleccionada = null;
    },
    error: (err) => {
      console.error('Error al buscar:', err);
      alert('No se pudo encontrar información.');
    }
  });
}

  cargarCarnet(m: any) {
    this.idMascotaSeleccionada = m.idMascota;
    this.sv.obtenerCarnet(m.idMascota).subscribe(res => this.carnet = res.data);
  }

  registrar() {
    if (this.idMascotaSeleccionada && this.nuevaVacuna.idVacuna) {
      this.sv.registrarVacunaManual(this.idMascotaSeleccionada, this.nuevaVacuna as any).subscribe(res => {
        this.carnet = res.data; // Actualización automática
        this.nuevaVacuna = { idVacuna: null, dosisTipo: '', fecha: '' }; // Limpiar
      });
    }
  }
}
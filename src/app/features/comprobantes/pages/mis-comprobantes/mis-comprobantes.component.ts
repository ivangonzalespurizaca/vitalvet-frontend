import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComprobanteService } from '../../../../core/services/comprobante.service';
import { ComprobanteDTO } from '../../../../core/interfaces/comprobante';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mis-comprobantes.component.html',
  styleUrls: ['./mis-comprobantes.component.css']
})
export class MisComprobantesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private comprobanteService = inject(ComprobanteService);

  filtroForm!: FormGroup;
  comprobantes: ComprobanteDTO[] = [];
  selectedComprobante: ComprobanteDTO | null = null;

  ngOnInit(): void {
    this.iniciarFiltros();
    this.cargarMisComprobantes();
  }

  iniciarFiltros() {
    this.filtroForm = this.fb.group({
      tipo: [''],
      inicio: [''],
      fin: ['']
    });
  }

  cargarMisComprobantes() {
    const { tipo, inicio, fin } = this.filtroForm.value;
    
    // Llamamos al endpoint específico para clientes
    this.comprobanteService.obtenerMisComprobantes(tipo || undefined, inicio || undefined, fin || undefined)
      .subscribe({
        next: (res) => {
          // Ajusta según la estructura que retorna ComprobanteClienteResponse
          this.comprobantes = res.contenido || [];
        },
        error: (err) => console.error('Error cargando comprobantes:', err)
      });
  }

  verDetalle(id: number) {
    this.selectedComprobante = this.comprobantes.find(c => c.idComprobante === id) || null;
  }

  cerrarModal() {
    this.selectedComprobante = null;
  }
}
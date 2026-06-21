import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComprobanteService } from '../../../../core/services/comprobante.service';
import { ComprobanteDTO } from '../../../../core/interfaces/comprobante';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.css']
})
export class ComprobantesListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private comprobanteService = inject(ComprobanteService);

  filtroForm!: FormGroup;
  comprobantes: ComprobanteDTO[] = [];
  selectedComprobante: ComprobanteDTO | null = null;
  stats = { emitidos: 0, total: 0 };

  ngOnInit(): void {
    this.iniciarFiltros();
    this.cargarComprobantes();
  }

  iniciarFiltros() {
    // Eliminamos 'criterio' porque ya no existe en el HTML
    this.filtroForm = this.fb.group({
      tipo: [''],
      inicio: [''],
      fin: ['']
    });
  }

  limpiarFiltros() {
    // Resetea los valores del formulario a vacío
    this.filtroForm.reset({
      tipo: '',
      inicio: '',
      fin: ''
    });
    // Recarga la lista original
    this.cargarComprobantes();
  }

  cargarComprobantes() {
    const formValue = this.filtroForm.value;

    // Aquí solo tomamos los campos que realmente existen en el formulario
    const tipo = formValue.tipo || undefined;
    const inicio = formValue.inicio || undefined;
    const fin = formValue.fin || undefined;

    console.log('Enviando filtros:', { tipo, inicio, fin });

    // Asegúrate de que este método en tu servicio ya no reciba 'criterio'
    this.comprobanteService.consultarHistorial(tipo, inicio, fin).subscribe({
      next: (res) => {
        this.comprobantes = res.contenido;
        this.stats = {
          emitidos: res.totalComprobantesEmitidos,
          total: res.montoTotalRecaudado
        };
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al cargar comprobantes');
      }
    });
  }

verDetalle(id: number) {
  // Buscamos el comprobante en la lista ya cargada
  this.selectedComprobante = this.comprobantes.find(c => c.idComprobante === id) || null;
}

cerrarModal() {
  this.selectedComprobante = null;
}
}
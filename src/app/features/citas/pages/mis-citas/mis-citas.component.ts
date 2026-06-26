import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 👈 Agregado HttpClient e HttpHeaders
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CitaService } from '../../../../core/services/cita.service';
import { CitaPanelResponse, CitaDetalleResponse } from '../../../../core/interfaces/cita';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css'
})
export class MisCitasComponent implements OnInit {
  private citaService = inject(CitaService);
  private http = inject(HttpClient); // 👈 Inyectamos HttpClient de forma limpia
  private swalToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // Endpoint de tu Backend Spring Boot SOAP
  private soapUrl = 'http://localhost:8098/ws';

  citas: CitaPanelResponse[] = [];
  searchControl = new FormControl('');
  estadoFiltro: string = '';
  detalleSeleccionado: CitaDetalleResponse | null = null;
  mostrarModalDetalle = false;

  ngOnInit(): void {
    this.cargarCitas();
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.cargarCitas());
  }

  cargarCitas(): void {
    const busqueda = this.searchControl.value || '';
    this.citaService.obtenerPanelCitas(this.estadoFiltro || undefined, busqueda).subscribe({
      next: (res) => { if (res.success) this.citas = res.data; }
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

  // Variables para el control del modal de calificación
  mostrarModalCalificar: boolean = false;
  citaACalificar: any = null;
  puntuacionSeleccionada: number = 5;
  comentarioCalificacion: string = '';

  abrirCalificar(cita: any) {
    this.citaACalificar = cita;
    this.puntuacionSeleccionada = 5;
    this.comentarioCalificacion = '';
    this.mostrarModalCalificar = true;
  }

  cerrarCalificar() {
    this.mostrarModalCalificar = false;
    this.citaACalificar = null;
  }

  // 💥 AQUÍ SE CONECTA CON TU BACKEND SOAP SIN ALTERAR NADA MÁS
  guardarCalificacion() {
    // 1. Armamos el XML mapeando dinámicamente los datos de la cita elegida y el formulario
    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:com="http://example.com/veterinaria-vitalvet/comentarios">
         <soapenv:Header/>
         <soapenv:Body>
            <com:postComentarioRequest>
               <com:bean>
                  <com:id_coment></com:id_coment>
                  <com:nombreVeterinario>${this.citaACalificar.nombreMedico || 'No asignado'}</com:nombreVeterinario>
                  <com:opinion>${this.comentarioCalificacion}</com:opinion>
                  <com:estrellas>${this.puntuacionSeleccionada}</com:estrellas>
               </com:bean>
            </com:postComentarioRequest>
         </soapenv:Body>
      </soapenv:Envelope>
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'Accept': 'text/xml, application/xml, */*',
      'SOAPAction': '""'
    });


    this.http.post(this.soapUrl, soapEnvelope, { headers, responseType: 'text' }).subscribe({
      next: (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        const resultadoSalida = xmlDoc.getElementsByTagName('ns2:salida')[0]?.textContent;
        const status = parseInt(resultadoSalida || '0', 10);

        if (status > 0) {

          this.swalToast.fire({
            icon: 'success',
            title: '¡Calificación registrada con éxito!'
          });


          const citaModificada = this.citas.find(c => c.idCita === this.citaACalificar.idCita);
          if (citaModificada) {
            // Le añadimos una propiedad dinámica en tiempo de ejecución
            (citaModificada as any).calificada = true;
          }

          this.cerrarCalificar();
          // NOTA: Si quitas 'this.cargarCitas()', evitarás que se refresque desde la BD 
          // y se mantendrá el cambio visual inmediatamente en la pantalla.
        } else {
          alert('El servidor no pudo insertar el comentario.');
        }
      },
      error: (err) => {
        console.error('Error SOAP:', err);
                this.swalToast.fire({
          icon: 'error',
          title: err.error?.mensaje || 'Error al Conectar el SOAP.'
        });
      }
    });
  }
}
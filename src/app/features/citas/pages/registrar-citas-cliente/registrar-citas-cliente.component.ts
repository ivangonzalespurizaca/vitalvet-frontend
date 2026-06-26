import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../../core/services/cita.service';
import { VeterinarioService } from '../../../../core/services/veterinario.service';
import { MascotaService } from '../../../../core/services/mascota.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { HorarioService } from '../../../../core/services/horario.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registrar-citas-cliente.component.html',
  styleUrls: ['./registrar-citas-cliente.component.css']
})
export class RegistrarCitaClienteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private vetService = inject(VeterinarioService);
  private mascotaService = inject(MascotaService);
  private authService = inject(AuthService);
  private horarioService = inject(HorarioService);
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

  numeroTarjeta: string = '';
  expiraTarjeta: string = '';
  formulario!: FormGroup;
  mostrarModalPago = false;
  mascotas: any[] = [];
  fechaMinima = new Date().toISOString().split('T')[0];
  veterinarios: any[] = [];
  slots: any[] = [];
  horariosVeterinario: any[] = [];
  montoFijo = 50.00;

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarDatosIniciales();
  }

  iniciarFormulario() {
    this.formulario = this.fb.group({
      idVeterinario: ['', Validators.required],

      fecha: ['', Validators.required],

      hora: ['', Validators.required],

      idMascota: ['', Validators.required],

      motivo: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(250)
        ]
      ],

      tipoDocumento: ['BOLETA', Validators.required],

      metodoPago: ['TARJETA_DEBITO', Validators.required],

      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{16}$')
        ]
      ],

      expira: [
        '',
        [
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')
        ]
      ],

      cvc: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{3}$')
        ]
      ]
    });
  }

  cargarDatosIniciales() {
    this.vetService.listarVeterinarios('').subscribe(res => this.veterinarios = res.data);
    const idCliente = this.authService.getIdPersona();
    if (idCliente !== null) {
      this.mascotaService.listarPorCliente(idCliente).subscribe(res => this.mascotas = res.data);
    }
  }

  cargarSlots() {
    const { idVeterinario, fecha } = this.formulario.value;
    if (idVeterinario && fecha) {
      this.citaService.listarSlotsDisponibles(idVeterinario, fecha).subscribe(res => this.slots = res.data);
    }
  }

  cargarHorariosVeterinario() {
    const idVeterinario = this.formulario.get('idVeterinario')?.value;

    if (idVeterinario) {
      this.horarioService.obtenerPorVeterinario(idVeterinario).subscribe({
        next: (res) => {
          // Asumiendo que res.data tiene una propiedad 'horarios' como en tu endpoint
          this.horariosVeterinario = res.data.horarios || [];
        },
        error: () => this.horariosVeterinario = []
      });
    }
  }

  obtenerNombreMascotaSeleccionada(): string {
    const id = this.formulario.get('idMascota')?.value;
    const mascota = this.mascotas.find(m => m.idMascota == id);
    return mascota ? `${mascota.nombreMascota} (${mascota.nombreRaza})` : 'No seleccionada';
  }

  obtenerNombreVeterinarioSeleccionado(): string {
    const id = this.formulario.get('idVeterinario')?.value;
    const vet = this.veterinarios.find(v => v.idVeterinario == id);
    return vet ? `${vet.nombres} ${vet.apellidos}` : 'No seleccionado';
  }

  // Reemplaza estas funciones por estas versiones simples
  formatearTarjeta(event: any) {
    // Solo permitimos números, el resto lo dejamos fluir natural
    let value = event.target.value.replace(/\D/g, '');
    this.formulario.patchValue({ numeroTarjeta: value }, { emitEvent: false });
  }

  puedeReservar(): boolean {
    return (
      this.formulario.get('idVeterinario')?.valid &&
      this.formulario.get('idMascota')?.valid &&
      this.formulario.get('fecha')?.valid &&
      this.formulario.get('hora')?.valid &&
      this.formulario.get('motivo')?.valid
    ) ?? false;
  }

  formatearFecha(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    this.formulario.patchValue({ expira: value }, { emitEvent: false });
  }

  confirmarCita() {


    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const form = this.formulario.value;
    if (!form.hora) {
      this.swalToast.fire({
        icon: 'warning',
        title: 'Seleccione un horario disponible.'
      });
      return;
    }

    // 1. Normalización total: quitamos puntos, espacios extra y convertimos a minúsculas
    const horaRaw = form.hora.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');

    // 2. Extraer horas y minutos. Buscamos números antes y después de los dos puntos
    const match = horaRaw.match(/(\d{1,2}):(\d{2})/);
    if (!match) {
      this.swalToast.fire({
        icon: 'error',
        title: 'No se pudo interpretar la hora seleccionada.'
      });
    }

    let horas = parseInt(match[1], 10);
    const minutos = match[2];

    // 3. Detectar si es PM (si contiene 'p')
    const esPM = horaRaw.includes('p');

    // 4. Conversión lógica a 24 horas
    if (esPM && horas < 12) {
      horas += 12;
    } else if (!esPM && horas === 12) {
      horas = 0;
    }

    // 5. Formatear a HH:mm:ss
    const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos}:00`;

    const request = {
      ...form,
      idCliente: this.authService.getIdPersona(),
      hora: horaFormateada,
      montoTotal: this.montoFijo
    };

    console.log("Payload enviado al servidor:", request);

    this.citaService.registrarCita(request).subscribe({
      next: () => {
        this.swalToast.fire({
          icon: 'success',
          title: 'Cita registrada correctamente.'
        });
        this.mostrarModalPago = false;
        this.formulario.reset();
        this.mascotas = [];
        this.slots = [];
        this.horariosVeterinario = [];
      },
      error: (err) => {
        console.error(err);
        this.swalToast.fire({
          icon: 'error',
          title: err.error?.mensaje || 'No se pudo registrar la cita.'
        });
      }
    });
  }
}
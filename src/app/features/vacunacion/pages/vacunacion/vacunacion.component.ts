import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import Swal from 'sweetalert2';

import { VacunacionService } from '../../../../core/services/vacunacion.service';
import { VacunaService } from '../../../../core/services/vacuna.service';
import { ClienteService } from '../../../../core/services/cliente.service';

import { MascotasResponse, VacunaRegistroRequestDTO } from '../../../../core/interfaces/vacuna-gestion';
import { VacunaDTO } from '../../../../core/interfaces/vacuna';
import { CarnetVacunaDTO } from '../../../../core/interfaces/carnet';
import { ClienteResponse } from '../../../../core/interfaces/cliente-response';
import { MascotaResponseDTO } from '../../../../core/interfaces/mascota-response';

@Component({
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule],
  templateUrl: './vacunacion.component.html',
  styleUrls: ['./vacunacion.component.css']
})
export class VacunacionComponent implements OnInit {

  private vacunacionService = inject(VacunacionService);
  private vacunaService = inject(VacunaService);
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);

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

  //=========================
  // MODAL CLIENTES
  //=========================

  mostrarModalClientes = false;
  criterioCliente = '';
  clientes: ClienteResponse[] = [];
  clienteSeleccionado: ClienteResponse | null = null;

  //=========================
  // CLIENTE Y MASCOTAS
  //=========================

  cliente: MascotasResponse | null = null;
  mascotas: MascotaResponseDTO[] = [];

  //=========================
  // CARNET
  //=========================

  idMascotaSeleccionada: number | null = null;
  carnet: CarnetVacunaDTO | null = null;

  //=========================
  // VACUNAS
  //=========================

  catalogoVacunas: VacunaDTO[] = [];

  formulario!: FormGroup;

  //=========================
  // INIT
  //=========================

ngOnInit(): void {

  this.formulario = this.fb.group({

    idVacuna: [0, [
      Validators.required,
      Validators.min(1)
    ]],

    dosisTipo: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],

    fecha: ['', Validators.required]

  });

  this.cargarCatalogoVacunas();

}

  cargarCatalogoVacunas() {
    this.vacunaService.listarActivas().subscribe({
      next: (res) => {
        this.catalogoVacunas = res.data;
      }
    });
  }

  //=========================
  // CLIENTES
  //=========================

  abrirModalClientes() {
    this.mostrarModalClientes = true;
    this.buscarClientes();
  }

  buscarClientes() {

    this.clienteService
      .listarClientes(this.criterioCliente)
      .subscribe({

        next: (res) => {

          if (res.success) {
            this.clientes = res.data;
          }

        }

      });

  }

  seleccionarCliente(cliente: ClienteResponse) {

    this.clienteSeleccionado = cliente;

    this.mostrarModalClientes = false;

    this.vacunacionService
      .buscarPanelPorDni(cliente.dni)
      .subscribe({

        next: (data) => {

          this.cliente = data;

          this.mascotas = data.mascotas;

          this.carnet = null;

          this.idMascotaSeleccionada = null;

        },

        error: () => {

          this.swalToast.fire({
            icon: 'error',
            title: 'No se pudo obtener la información del cliente.'
          });

        }

      });

  }
  //=========================
  // CARGAR CARNET
  //=========================

  cargarCarnet(mascota: MascotaResponseDTO) {

    this.idMascotaSeleccionada = mascota.idMascota;

    this.vacunacionService
      .obtenerCarnet(mascota.idMascota)
      .subscribe({

        next: (res) => {

          this.carnet = res.data;

        },

        error: () => {

          this.swalToast.fire({
            icon: 'error',
            title: 'No se pudo cargar el carnet.'
          });

        }

      });

  }

  //=========================
  // REGISTRAR VACUNA
  //=========================

registrar() {

  if (this.formulario.invalid) {

    this.formulario.markAllAsTouched();

    return;

  }

  if (!this.idMascotaSeleccionada) {

    this.swalToast.fire({
      icon:'warning',
      title:'Seleccione una mascota.'
    });

    return;

  }

  const data: VacunaRegistroRequestDTO = this.formulario.value;

  this.vacunacionService
      .registrarVacunaManual(
        this.idMascotaSeleccionada,
        data
      )
      .subscribe({

        next:(res)=>{

          this.carnet = res.data;

          this.formulario.reset({

            idVacuna:0,
            dosisTipo:'',
            fecha:''

          });

          this.swalToast.fire({

            icon:'success',

            title:'Vacuna registrada correctamente.'

          });

        },

        error:(err)=>{

          this.swalToast.fire({

            icon:'error',

            title:err.error?.mensaje ??
                  'No se pudo registrar.'

          });

        }

      });

}

  confirmarAplicacion(idAplicacion: number) {
    if (!this.idMascotaSeleccionada) {
      return;
    }

    Swal.fire({
      title: '¿Confirmar aplicación?',
      text: 'La vacuna pasará a estado APLICADA.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) {
        return;
      }

      this.vacunacionService
        .confirmarAplicacion(idAplicacion)
        .subscribe({
          next: (res) => {
            this.carnet = res.data;
            this.swalToast.fire({
              icon: 'success',
              title: 'Vacuna confirmada.'
            });
          },

          error: (err) => {
            this.swalToast.fire({
              icon: 'error',
              title: err.error?.mensaje ?? 'No se pudo confirmar.'
            });
          }
        });
    });
  }
}
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MascotaService } from '../../../core/services/mascota.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { MediaService } from '../../../core/services/media.service'; // Importa el servicio de media
import { Especie, Raza } from '../../../core/interfaces/catalogos';
import { MascotaRequestDTO } from '../../../core/interfaces/mascota-response';

@Component({
  selector: 'app-mascota-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mascota-modal.component.html',
  styleUrls: ['./mascota-modal.component.css']
})
export class MascotaModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private mascotaService = inject(MascotaService);
  private catalogoService = inject(CatalogoService);
  private mediaService = inject(MediaService); // Inyecta MediaService

  @Input() idMascota: number | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() exito = new EventEmitter<void>();

  formulario!: FormGroup;
  cargandoDatos = signal<boolean>(false);
  guardando = signal<boolean>(false);

  imagenPreview = signal<string | null>(null);
  imagenArchivo: File | null = null; // Almacena el archivo para el upload

  especies: Especie[] = [];
  todasLasRazas: Raza[] = [];
  razasFiltradas: Raza[] = [];

  ngOnInit(): void {
    this.iniciarFormulario();
    this.cargarCatalogos();

    if (this.idMascota) {
      this.cargarDatosMascota();
    }
  }

  private iniciarFormulario(): void {
    this.formulario = this.fb.group({
      nombreMascota: ['', [Validators.required]],
      idEspecie: [null, [Validators.required]],
      idRaza: [{ value: null, disabled: true }, [Validators.required]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      pesoActual: [null, [Validators.required, Validators.min(0.1)]],
      fotoUrl: ['']
    });

    this.formulario.get('idEspecie')?.valueChanges.subscribe(idEspecie => {
      this.filtrarRazas(Number(idEspecie));
    });
  }

  private cargarCatalogos(): void {
    this.catalogoService.obtenerEspeciesActivas().subscribe(res => {
      if (res.success) this.especies = res.data;
    });
    this.catalogoService.obtenerTodasLasRazasActivas().subscribe(res => {
      if (res.success) this.todasLasRazas = res.data;
    });
  }

  private filtrarRazas(idEspecie: number): void {
    const controlRaza = this.formulario.get('idRaza');
    if (idEspecie) {
      this.razasFiltradas = this.todasLasRazas.filter(r => r.idEspecie === idEspecie);
      controlRaza?.enable();
    } else {
      this.razasFiltradas = [];
      controlRaza?.disable();
    }
    controlRaza?.setValue(null);
  }

  private cargarDatosMascota(): void {
    this.cargandoDatos.set(true);
    this.mascotaService.obtenerPorId(this.idMascota!).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.filtrarRazas(res.data.idEspecie);
          this.formulario.patchValue(res.data);
          if (res.data.fotoUrl) {
            this.imagenPreview.set(res.data.fotoUrl);
          }
        }
      },
      error: () => this.cargandoDatos.set(false),
      complete: () => this.cargandoDatos.set(false)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es muy pesada (máx 2MB).');
        return;
      }
      this.imagenArchivo = file; // Guardamos el archivo real
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  private obtenerIdClienteDesdeToken(): number | undefined {
    const token = localStorage.getItem('token');
    if (!token) return undefined;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.idPersona || payload.idpersona;
    } catch { return undefined; }
  }

  async guardar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);

    try {
      let urlFotoFinal = this.formulario.get('fotoUrl')?.value;

      // Si hay un archivo nuevo, lo subimos usando MediaService
      if (this.imagenArchivo) {
        const respMedia = await this.mediaService.subirFoto(this.imagenArchivo).toPromise();
        if (respMedia?.success && respMedia.data?.urlFoto) {
          urlFotoFinal = respMedia.data.urlFoto; // URL corta y segura
        } else {
          throw new Error('Error al subir la imagen');
        }
      }

      const formValues = this.formulario.getRawValue();
      const data: MascotaRequestDTO = {
        nombreMascota: formValues.nombreMascota,
        idRaza: Number(formValues.idRaza),
        sexo: formValues.sexo,
        fechaNacimiento: formValues.fechaNacimiento,
        pesoActual: formValues.pesoActual,
        fotoUrl: urlFotoFinal,
        idCliente: this.obtenerIdClienteDesdeToken()!
      };

      const observable = this.idMascota
        ? this.mascotaService.editarMascota(this.idMascota, data)
        : this.mascotaService.registrarMascota(data);

      observable.subscribe({
        next: () => this.exito.emit(),
        error: (err) => {
          this.guardando.set(false);
          alert(err.error?.mensaje || 'Error al guardar');
        }
      });
    } catch (error) {
      this.guardando.set(false);
      alert('Ocurrió un error al procesar el registro.');
    }
  }
}

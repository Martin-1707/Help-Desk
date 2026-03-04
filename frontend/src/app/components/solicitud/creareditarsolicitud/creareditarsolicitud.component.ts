import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Prioridad } from '../../../models/prioridad';
import { SolicitudSoporte } from '../../../models/solicitud-soporte.model';

import { SolicitudService, SolicitudCreateUpdateDTO } from '../../../services/solicitud.service';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioPick } from '../../../models/usuario-pick.model';

import { LoginService } from '../../../services/login.service';
import { Estado } from '../../../models/estado';

@Component({
  selector: 'app-creareditarsolicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './creareditarsolicitud.component.html',
  styleUrl: './creareditarsolicitud.component.css'
})
export class CreareditarsolicitudComponent implements OnInit {

  // UI
  isLoading = false;

  // ✅ modo por ruta
  mode: 'create' | 'edit' | 'view' = 'create';
  esVista = false;
  modoEdicion = false;

  // params
  idSolicitud = 0;

  // auth
  usernameActual = '';
  rolActual = '';
  esOperador = false;

  private estadoOriginal: Estado = Estado.NUEVO;

  solucionLabel = '';
  fechaResolucionValue: string | null = null;

  usuariosRolUsuario: UsuarioPick[] = [];

  readonly estados: Estado[] = [Estado.NUEVO, Estado.EN_PROCESO, Estado.RESUELTO, Estado.CERRADO];
  readonly prioridades: Prioridad[] = [Prioridad.ALTA, Prioridad.MEDIA, Prioridad.BAJA];

  form!: FormGroup;

  solucionCtrl = new FormControl('', [
    Validators.minLength(5),
    Validators.maxLength(2000),
  ]);

  savingSolucion = false;

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    // ✅ null-safe
    this.usernameActual = this.loginService.showUser() ?? '';
    this.rolActual = (this.loginService.showRole() ?? '').toUpperCase();
    this.esOperador = this.rolActual.includes('OPERADOR');

    console.log('rolActual:', this.rolActual, 'esOperador:', this.esOperador);

    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      prioridad: [Prioridad.MEDIA, [Validators.required]],
      estado: [{ value: Estado.NUEVO, disabled: true }, [Validators.required]],

      solicitanteUsername: [{ value: '', disabled: true }], // display
      solicitanteId: [null],                                // select (operador/crear)
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.idSolicitud = idParam ? Number(idParam) : 0;

    this.mode = (this.route.snapshot.data['mode'] ?? (this.idSolicitud ? 'edit' : 'create')) as any;
    this.esVista = this.mode === 'view';
    this.modoEdicion = this.mode === 'edit';

    if (this.mode === 'create') {
      this.form.get('estado')?.disable({ emitEvent: false });
      this.form.patchValue({ estado: Estado.NUEVO }, { emitEvent: false });

      if (this.esOperador) {
        this.form.get('solicitanteId')?.setValidators([Validators.required]);
        this.form.get('solicitanteId')?.updateValueAndValidity({ emitEvent: false });

        this.form.patchValue({ solicitanteUsername: '' }, { emitEvent: false });
        this.cargarUsuariosRolUsuario();
      } else {
        this.form.get('solicitanteId')?.clearValidators();
        this.form.get('solicitanteId')?.updateValueAndValidity({ emitEvent: false });

        this.form.patchValue({ solicitanteUsername: this.usernameActual }, { emitEvent: false });
      }
      return;
    }

    this.cargarSolicitud(this.idSolicitud);
  }

  private cargarUsuariosRolUsuario(): void {
    this.usuarioService.listByRol('USUARIO').subscribe({
      next: (data) => this.usuariosRolUsuario = data ?? [],
      error: () => {
        this.usuariosRolUsuario = [];
        this.snackBar.open('⚠️ No se pudo cargar la lista de usuarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private cargarSolicitud(id: number): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.solicitudService.getById(id).subscribe({
      next: (s: SolicitudSoporte) => {
        this.estadoOriginal = s.estado;

        this.form.patchValue({
          titulo: s.titulo,
          descripcion: (s as any).descripcion ?? '',
          prioridad: s.prioridad,
          estado: s.estado,
          solicitanteUsername: s.solicitanteUser
            ? `${(s.solicitanteUser as any).nombres ?? ''} (${s.solicitanteUser.username})`.trim()
            : '',
        });

        this.form.get('solicitanteId')?.clearValidators();
        this.form.get('solicitanteId')?.updateValueAndValidity({ emitEvent: false });

        if (this.esVista) {
          this.form.disable({ emitEvent: false });
        } else {
          if (s.estado === Estado.CERRADO) this.form.get('estado')?.disable({ emitEvent: false });
          else this.form.get('estado')?.enable({ emitEvent: false });
        }

        this.isLoading = false;

        const anyS: any = s;
        const solucion = (anyS.solucion ?? '').toString();

        // setValue primero
        this.solucionCtrl.setValue(solucion, { emitEvent: false });

        // ✅ también alimenta el label para vista
        this.solucionLabel = solucion;

        // si tienes fecha en el backend:
        this.fechaResolucionValue = anyS.fechaResolucion ?? null;

        // ✅ luego reglas
        const estaCerrado = s.estado === Estado.CERRADO;

        if (this.esVista) {
          this.solucionCtrl.disable({ emitEvent: false });
        } else if (!this.esOperador) {
          this.solucionCtrl.disable({ emitEvent: false });
        } else if (estaCerrado) {
          this.solucionCtrl.disable({ emitEvent: false }); // si quieres bloquear en cerrado
        } else {
          this.solucionCtrl.enable({ emitEvent: false });  // ✅ operador puede escribir aunque esté vacío
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('❌ No se pudo cargar la solicitud', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/solicitudes']);
      },
    });
  }

  async guardar(): Promise<void> {
  if (this.esVista || this.isLoading) return;

  // valida form base
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.snackBar.open('⚠️ Completa los campos correctamente', 'Cerrar', { duration: 3000 });
    return;
  }

  // valida solución solo si aplica
  const debeGuardarSolucion =
    this.modoEdicion &&
    this.esOperador &&
    this.form.get('estado')?.value !== Estado.CERRADO; // ajusta si string/enum

  if (debeGuardarSolucion) {
    const sol = (this.solucionCtrl.value ?? '').trim();

    // si quieres que sea obligatoria para operador en edición, valida así:
    if (sol.length < 5 || this.solucionCtrl.invalid) {
      this.solucionCtrl.markAsTouched();
      this.snackBar.open('⚠️ Escribe una solución válida (mín. 5 caracteres)', 'Cerrar', { duration: 3000 });
      return;
    }
  }

  const v = this.form.getRawValue();

  const dto: SolicitudCreateUpdateDTO = {
    titulo: v.titulo,
    descripcion: v.descripcion,
    prioridad: v.prioridad,
    ...(this.mode === 'create' && this.esOperador ? { solicitanteId: Number(v.solicitanteId) } : {})
  };

  this.isLoading = true;

  // CREATE
  if (this.mode === 'create') {
    this.solicitudService.create(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('✅ Solicitud creada', 'Cerrar', { duration: 2500 });
        this.router.navigate(['/solicitudes']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('❌ Error al crear la solicitud', 'Cerrar', { duration: 3000 });
      },
    });
    return;
  }

  // EDIT: update base
  this.solicitudService.update(this.idSolicitud, dto).subscribe({
    next: () => {
      const estadoNuevo: Estado = v.estado;
      const cambioEstado = estadoNuevo !== this.estadoOriginal;

      const afterEstado = () => {
        // luego de update + (opcional) changeEstado, guarda solución si aplica
        if (!debeGuardarSolucion) {
          this.isLoading = false;
          this.snackBar.open('✏️ Solicitud actualizada', 'Cerrar', { duration: 2500 });
          this.router.navigate(['/solicitudes']);
          return;
        }

        const solucion = (this.solucionCtrl.value ?? '').trim();

        this.solicitudService.saveSolucion(this.idSolicitud, solucion).subscribe({
          next: (updated) => {
            this.isLoading = false;
            const anyU: any = updated;
            this.solucionLabel = (anyU.solucion ?? solucion).toString();
            this.fechaResolucionValue = anyU.fechaResolucion ?? this.fechaResolucionValue;

            this.snackBar.open('✅ Cambios guardados', 'Cerrar', { duration: 2500 });
            this.router.navigate(['/solicitudes']);
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('⚠️ Se guardó la solicitud, pero falló guardar la solución', 'Cerrar', { duration: 3500 });
          },
        });
      };

      if (!cambioEstado) {
        afterEstado();
        return;
      }

      // cambio estado
      this.solicitudService.changeEstado(this.idSolicitud, estadoNuevo).subscribe({
        next: () => afterEstado(),
        error: () => {
          // aun así intenta guardar solución (o puedes cortar aquí)
          this.snackBar.open('⚠️ Se actualizó, pero falló el cambio de estado', 'Cerrar', { duration: 3500 });
          afterEstado();
        },
      });
    },
    error: () => {
      this.isLoading = false;
      this.snackBar.open('❌ Error al actualizar la solicitud', 'Cerrar', { duration: 3000 });
    },
  });
}

  cancelar(): void {
    this.router.navigate(['/solicitudes']);
  }

  estadoLabel(e: Estado): string {
    switch (e) {
      case Estado.NUEVO: return 'Nuevo';
      case Estado.EN_PROCESO: return 'En Proceso';
      case Estado.RESUELTO: return 'Resuelto';
      case Estado.CERRADO: return 'Cerrado';
      default: return String(e);
    }
  }

  prioridadLabel(p: Prioridad): string {
    switch (p) {
      case Prioridad.ALTA: return 'Alta';
      case Prioridad.MEDIA: return 'Media';
      case Prioridad.BAJA: return 'Baja';
      default: return String(p);
    }
  }

  guardarSolucion(): void {
    if (!this.modoEdicion) return;
    if (!this.esOperador) return;

    if (this.savingSolucion || this.isLoading) return;

    if (this.solucionCtrl.invalid) {
      this.solucionCtrl.markAsTouched();
      this.snackBar.open('⚠️ Escribe una solución válida', 'Cerrar', { duration: 2500 });
      return;
    }

    const solucion = (this.solucionCtrl.value ?? '').trim();
    if (solucion.length < 5) {
      this.solucionCtrl.markAsTouched();
      this.snackBar.open('⚠️ La solución debe tener mínimo 5 caracteres', 'Cerrar', { duration: 2500 });
      return;
    }
    this.savingSolucion = true;

    this.solicitudService.saveSolucion(this.idSolicitud, solucion).subscribe({
      next: (updated) => {
        this.savingSolucion = false;
        this.snackBar.open('✅ Solución guardada', 'Cerrar', { duration: 2500 });

        const anyU: any = updated;
        const sol = (anyU.solucion ?? this.solucionCtrl.value ?? '').toString();

        // ✅ refrescar lo mostrado
        this.solucionLabel = sol;
        this.solucionCtrl.setValue(sol, { emitEvent: false });

        this.fechaResolucionValue = anyU.fechaResolucion ?? this.fechaResolucionValue;
      },
      error: () => {
        this.savingSolucion = false;
        this.snackBar.open('❌ No se pudo guardar la solución', 'Cerrar', { duration: 3000 });
      },
    });
  }
}

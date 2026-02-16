import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { SolicitudService } from '../../../services/solicitud.service';
import { LoginService } from '../../../services/login.service';

import { SolicitudSoporte } from '../../../models/solicitud-soporte.model';
import { Estado } from '../../../models/estado';
import { Prioridad } from '../../../models/prioridad';

@Component({
  selector: 'app-detallesolicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  templateUrl: './detallesolicitud.component.html',
  styleUrl: './detallesolicitud.component.css',
})
export class DetallesolicitudComponent implements OnInit {

  isLoading = false;

  idSolicitud = 0;
  solicitud: SolicitudSoporte | null = null;
  codigoLabel = '';
  descripcionLabel = '';
  solicitanteLabel = '';
  fechaCreacionValue: string | Date | null = null;
  fechaActualizacionValue: string | Date | null = null;

  rolActual = '';
  esOperador = false;

  esCerrado = false;

  formEstado!: FormGroup;

  readonly Estado = Estado;

  readonly estados: Estado[] = [
    Estado.NUEVO,
    Estado.EN_PROCESO,
    Estado.RESUELTO,
    Estado.CERRADO,
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.rolActual = (this.loginService.showRole() ?? '').toUpperCase();
    this.esOperador = this.rolActual.includes('OPERADOR');

    this.formEstado = this.fb.group({
      estado: [null as Estado | null, Validators.required],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.idSolicitud = idParam ? Number(idParam) : 0;

    if (!this.idSolicitud) {
      this.router.navigate(['/solicitudes']);
      return;
    }

    this.cargarDetalle();
  }

  private cargarDetalle(): void {
    if (this.isLoading) return;

    this.isLoading = true;

    this.solicitudService.getById(this.idSolicitud).subscribe({
            next: (s) => {
        this.solicitud = s;
        this.esCerrado = s.estado === Estado.CERRADO;

        this.formEstado.patchValue({ estado: s.estado }, { emitEvent: false });

        if (this.esCerrado) this.formEstado.disable({ emitEvent: false });
        else this.formEstado.enable({ emitEvent: false });

        const anyS: any = s;

        this.codigoLabel = anyS.codigo ?? `SOL-${s.id}`;
        this.descripcionLabel = anyS.descripcion ?? anyS.description ?? '';

        const su = anyS.solicitanteUser;
        this.solicitanteLabel = su?.nombres ?? su?.username ?? '';

        this.fechaCreacionValue = anyS.fechaCreacion ?? null;
        this.fechaActualizacionValue = anyS.fechaActualizacion ?? null;

        this.isLoading = false;
      },

      error: () => {
        this.isLoading = false;
        this.snackBar.open('❌ No se pudo cargar el detalle', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/solicitudes']);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/solicitudes']);
  }

  editar(): void {
    this.router.navigate(['/solicitudes', this.idSolicitud, 'editar']);
  }

  opcionEstadoDeshabilitada(e: Estado): boolean {
    if (!this.esOperador && (e === Estado.RESUELTO || e === Estado.CERRADO)) return true;

    if (this.esCerrado) return true;

    return false;
  }

  guardarEstado(): void {
    if (!this.solicitud) return;
    if (this.formEstado.invalid) return;

    const nuevoEstado = this.formEstado.value.estado as Estado;

    if (this.esCerrado) return;

    if (nuevoEstado === this.solicitud.estado) {
      this.snackBar.open('ℹ️ No hay cambios en el estado', 'Cerrar', { duration: 2000 });
      return;
    }

    this.isLoading = true;
    this.solicitudService.changeEstado(this.idSolicitud, nuevoEstado).subscribe({
      next: () => {
        this.isLoading = false;

        this.solicitud = { ...this.solicitud!, estado: nuevoEstado } as any;
        this.esCerrado = nuevoEstado === Estado.CERRADO;

        this.snackBar.open('✅ Estado actualizado', 'Cerrar', { duration: 2500 });
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('❌ No se pudo cambiar el estado', 'Cerrar', { duration: 3000 });

        this.formEstado.patchValue({ estado: this.solicitud!.estado }, { emitEvent: false });
      },
    });
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
}

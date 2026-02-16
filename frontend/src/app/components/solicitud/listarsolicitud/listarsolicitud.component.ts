import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Estado } from '../../../models/estado';
import { Prioridad } from '../../../models/prioridad';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SolicitudService } from '../../../services/solicitud.service';
import { SolicitudSoporte } from '../../../models/solicitud-soporte.model';

import { of, debounceTime, distinctUntilChanged, startWith, switchMap, map, catchError, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HorarioService } from '../../../services/horario.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

type EstadoFiltro = Estado | 'TODOS';
type PrioridadFiltro = Prioridad | 'TODAS';

@Component({
  selector: 'app-listarsolicitud',
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
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './listarsolicitud.component.html',
  styleUrl: './listarsolicitud.component.css'
})
export class ListarsolicitudComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  isLoading = false;
  displayedColumns = ['id', 'titulo', 'solicitante', 'prioridad', 'estado', 'fechaCreacion', 'fechaActualizacion', 'acciones'];

  readonly estados: Estado[] = [Estado.NUEVO, Estado.EN_PROCESO, Estado.RESUELTO, Estado.CERRADO];
  readonly prioridades: Prioridad[] = [Prioridad.ALTA, Prioridad.MEDIA, Prioridad.BAJA];

  private all = signal<SolicitudSoporte[]>([]);
  currentPage = signal(1);
  readonly itemsPerPage = 5;

  form!: FormGroup;

  readonly totalFiltrados = computed(() => this.all().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.all().length / this.itemsPerPage)));

  readonly paginados = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.itemsPerPage;
    return this.all().slice(start, start + this.itemsPerPage);
  });

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private router: Router,
    private horarioService: HorarioService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: [''],
      estado: ['TODOS' as EstadoFiltro],
      prioridad: ['TODAS' as PrioridadFiltro],
      desde: [''],
      hasta: [''],
    });

    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),    
      debounceTime(350),                      
      map(v => this.buildFiltros(v)),         
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((filtros) => {
        this.currentPage.set(1);             
        this.isLoading = true;

        return this.solicitudService.list(filtros).pipe(
          catchError(() => of([] as SolicitudSoporte[])),
          finalize(() => this.isLoading = false)
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((data) => {
      this.all.set(data ?? []);
    });
  }

  private buildFiltros(v: any) {
    const estado = v.estado !== 'TODOS' ? (v.estado as Estado) : undefined;
    const prioridad = v.prioridad !== 'TODAS' ? (v.prioridad as Prioridad) : undefined;

    const tituloRaw = (v.titulo ?? '').trim();
    const titulo = tituloRaw.length >= 2 ? tituloRaw : undefined;

    const desde = v.desde ? `${v.desde}T00:00:00.000Z` : undefined;
    const hasta = v.hasta ? `${v.hasta}T23:59:59.999Z` : undefined;

    return { estado, prioridad, titulo, desde, hasta };
  }

  limpiar(): void {
    this.form.reset({
      titulo: '',
      estado: 'TODOS',
      prioridad: 'TODAS',
      desde: '',
      hasta: '',
    });
  }

  prev(): void {
    this.currentPage.set(Math.max(1, this.currentPage() - 1));
  }

  next(): void {
    this.currentPage.set(Math.min(this.totalPages(), this.currentPage() + 1));
  }

  estadoLabel(e: Estado): string {
    switch (e) {
      case Estado.NUEVO: return 'Nuevo';
      case Estado.EN_PROCESO: return 'En Proceso';
      case Estado.RESUELTO: return 'Resuelto';
      case Estado.CERRADO: return 'Cerrado';
      default: return e;
    }
  }

  prioridadLabel(p: Prioridad): string {
    switch (p) {
      case Prioridad.ALTA: return 'Alta';
      case Prioridad.MEDIA: return 'Media';
      case Prioridad.BAJA: return 'Baja';
      default: return p;
    }
  }

  nueva(): void {
    this.router.navigate(['/solicitudes/nueva']);
  }

  ver(id: number) { this.router.navigate(['/solicitudes', id]); }

  editar(id: number) { this.router.navigate(['/solicitudes', id, 'editar']); }

  verHorario(): void {
  }
}

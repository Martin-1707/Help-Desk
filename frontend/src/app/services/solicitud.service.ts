import { Injectable } from '@angular/core';
import { Estado } from '../models/estado';
import { Prioridad } from '../models/prioridad';
import { environment } from '../../environments/evironment.exam';
import { Subject } from 'rxjs';
import { SolicitudSoporte } from '../models/solicitud-soporte.model';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface SolicitudFiltros {
  estado?: Estado | null;
  prioridad?: Prioridad | null;
  titulo?: string | null;
  desde?: string | null;
  hasta?: string | null;
}

export interface SolicitudCreateUpdateDTO {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  solicitanteId?: number;
}

export interface CambiarEstadoDTO {
  estado: Estado;
}

const base_url = environment.base;

@Injectable({ providedIn: 'root' })
export class SolicitudService {

  private url = `${base_url}/solicitudes`;
  private listaCambio = new Subject<SolicitudSoporte[]>();

  constructor(private http: HttpClient) { }

  list(filtros?: SolicitudFiltros) {
    let params = new HttpParams();

    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.prioridad) params = params.set('prioridad', filtros.prioridad);

    const titulo = filtros?.titulo?.trim();
    if (titulo) params = params.set('titulo', titulo);

    if (filtros?.desde) params = params.set('desde', filtros.desde);
    if (filtros?.hasta) params = params.set('hasta', filtros.hasta);

    return this.http.get<SolicitudSoporte[]>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<SolicitudSoporte>(`${this.url}/${id}`);
  }

  create(dto: SolicitudCreateUpdateDTO) {
    return this.http.post<SolicitudSoporte>(this.url, dto);
  }

  update(id: number, dto: SolicitudCreateUpdateDTO) {
    return this.http.put<SolicitudSoporte>(`${this.url}/${id}`, dto);
  }

  changeEstado(id: number, estado: Estado) {
    return this.http.patch<SolicitudSoporte>(`${this.url}/${id}/estado`, { estado });
  }

  getList() { return this.listaCambio.asObservable(); }
  setList(listaNueva: SolicitudSoporte[]) { this.listaCambio.next(listaNueva); }
}

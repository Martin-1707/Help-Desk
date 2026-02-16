import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Horario } from '../models/horario.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.exam';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private url = `${base_url}/horarios`;
  private listaCambio = new Subject<Horario[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get(this.url);
  }
}
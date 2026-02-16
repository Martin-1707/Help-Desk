import { Injectable } from '@angular/core';
import { environment } from '../../environments/evironment.exam';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioPick } from '../models/usuario-pick.model';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = `${base_url}/usuarios`;
  constructor(private http: HttpClient) { }

  listByRol(rol: string): Observable<UsuarioPick[]> {
    const params = new HttpParams().set('rol', rol);
    return this.http.get<UsuarioPick[]>(this.baseUrl, { params });
  }
}
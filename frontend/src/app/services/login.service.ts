import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtRequest } from '../models/jwt-request.model';
import { environment } from '../../environments/evironment.exam';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(request: JwtRequest) {
    return this.http.post(`${environment.base}/login`, request);
  }

  getToken(): string {
    return sessionStorage.getItem('token') ?? '';
  }

  verificar(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  showUser(): string {
    const decoded = this.decodeToken();
    return decoded?.sub ?? '';
  }

  showRole(): string {
    const decoded = this.decodeToken();
    const role = decoded?.role ?? decoded?.rol ?? '';
    return String(role).toUpperCase();
  }

  isOperador(): boolean {
    return this.showRole().includes('OPERADOR');
  }

  isUsuario(): boolean {
    return this.showRole().includes('USUARIO');
  }

  // 🕵️‍♂️ decode
  private decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }
}

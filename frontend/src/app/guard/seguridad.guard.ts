import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Router } from 'express';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // 1) ¿Hay sesión?
  const isAuthenticated = loginService.verificar(); // token existe y (ideal) no expiró
  if (!isAuthenticated) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2) Roles (opcional)
  const allowedRoles = (route.data['roles'] as string[] | undefined) ?? [];
  if (allowedRoles.length === 0) return true; // si no defines roles en la ruta, deja pasar

  const userRole = loginService.showRole(); // ej: 'ADMIN' | 'OPERADOR' (según tu caso)
  if (!userRole || !allowedRoles.includes(userRole)) {
    router.navigate(['/solicitudes']); // o '/unauthorized'
    return false;
  }

  return true;
};
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const isAuthenticated = loginService.verificar(); 
  if (!isAuthenticated) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const allowedRoles = (route.data['roles'] as string[] | undefined) ?? [];
  if (allowedRoles.length === 0) return true;

  const userRole = loginService.showRole();
  if (!userRole || !allowedRoles.includes(userRole)) {
    router.navigate(['/solicitudes']);
    return false;
  }

  return true;
};
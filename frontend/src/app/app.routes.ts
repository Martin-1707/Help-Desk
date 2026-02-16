import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { CreareditarsolicitudComponent } from './components/solicitud/creareditarsolicitud/creareditarsolicitud.component';
import { DetallesolicitudComponent } from './components/solicitud/detallesolicitud/detallesolicitud.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [seguridadGuard],
    canActivateChild: [seguridadGuard],
    children: [
      { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },

      { path: 'solicitudes', component: SolicitudComponent },

      { path: 'solicitudes/nueva', component: CreareditarsolicitudComponent, data: { mode: 'create' } },

      { path: 'solicitudes/:id/editar', component: CreareditarsolicitudComponent, data: { mode: 'edit' } },

      { path: 'solicitudes/:id', component: DetallesolicitudComponent, data: { mode: 'view' } },
    ],
  },

  { path: '**', redirectTo: 'login' },
];

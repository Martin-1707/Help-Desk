import { Component } from '@angular/core';
import { ListarsolicitudComponent } from './listarsolicitud/listarsolicitud.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [RouterOutlet, ListarsolicitudComponent],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent {
  constructor(public route: ActivatedRoute) { }
}

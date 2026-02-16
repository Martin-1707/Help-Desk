import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { LoginService } from '../../services/login.service';
import { TopbarComponent } from './topbar/topbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidenavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  sidebarOpen = true;
  isMobile = false;

  ngOnInit() {
    const check = () => this.isMobile = window.innerWidth < 768;
    check();
    window.addEventListener('resize', check);
  }

  user = {
    nombres: sessionStorage.getItem('nombres') ?? '',
    username: sessionStorage.getItem('username') ?? '',
    rol: (sessionStorage.getItem('rol') ?? '').toUpperCase(),
  };

  constructor(private loginService: LoginService) { }

  onLogout() {
    this.loginService.logout();
  }
}

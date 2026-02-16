import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  @Input() sidebarOpen = true;
  @Input() isMobile = false;

  @Output() close = new EventEmitter<void>();

  menuItems: NavItem[] = [
    { path: '/solicitudes', label: 'Solicitudes', icon: 'confirmation_number' },
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  go(path: string) {
    this.router.navigateByUrl(path);
    if (this.isMobile) this.close.emit();
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginService } from '../../services/login.service';
import { JwtRequest } from '../../models/jwt-request.model';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  hide = signal(true);
  isLoading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  toggleHide(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;

    const request: JwtRequest = {
      username: this.form.value.username!,
      password: this.form.value.password!,
    };

    this.loginService.login(request).subscribe({
      next: (data: any) => {
        this.isLoading = false;

        if (data?.jwttoken) {
          sessionStorage.setItem('token', data.jwttoken);
          this.router.navigate(['/solicitudes']);
        } else {
          this.snackBar.open('No llegó token del backend', 'Cerrar', { duration: 2500 });
        }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 2000 });
      }
    });
  }
}
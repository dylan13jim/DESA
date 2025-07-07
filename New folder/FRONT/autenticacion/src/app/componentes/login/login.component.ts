import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user_ultimatix = '';
  user_password = '';
  mensaje = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ user_ultimatix: this.user_ultimatix, user_password: this.user_password }).subscribe({
      next: (res) => {
        this.mensaje = 'Inicio de sesión exitoso';
        this.error = '';
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.user));
        this.router.navigate(['/perfil']); // Redirige al perfil o app principal
      },
      error: (err) => {
        this.error = err.error.message || 'Credenciales incorrectas';
        this.mensaje = '';
      }
    });
  }

}

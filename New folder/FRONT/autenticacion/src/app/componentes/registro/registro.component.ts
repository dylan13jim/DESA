import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']  // corregido styleUrl -> styleUrls
})
export class RegistroComponent {
  // Aquí agrupamos toda la info en un solo objeto 'usuario'
  usuario = {
    user_name: {
      first_name: '',
      last_name: ''
    },
    user_email: '',
    user_password: '',
    role: 'analyst' // valor por defecto
  };

  mensaje = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    // Se envía el objeto completo al servicio, que espera un solo argumento
    this.authService.register(this.usuario).subscribe({
      next: (res) => {
        this.mensaje = 'Registro exitoso. Redirigiendo al login...';
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error.message || 'Ocurrió un error en el registro.';
        this.mensaje = '';
      }
    });
  }
}

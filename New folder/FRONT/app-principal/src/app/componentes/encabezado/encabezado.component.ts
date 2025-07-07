import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-encabezado',
  standalone: false,
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {
  constructor(private router: Router) {}

  irALogin() {
    this.router.navigateByUrl('/autenticacion/login');
  }

  irARegistro() {
    this.router.navigateByUrl('/autenticacion/registro');
  }

}

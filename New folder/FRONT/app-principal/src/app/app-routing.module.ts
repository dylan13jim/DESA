import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: 'autenticacion',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './ModuloAutenticacion'
      }).then(m => m.ModuloAutenticacion)
  },
  // Redirección por defecto si entra a la raíz
  {
    path: '',
    redirectTo: 'autenticacion/login',
    pathMatch: 'full'
  },
  // Redirección para rutas no existentes
  {
    path: '**',
    redirectTo: 'autenticacion/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

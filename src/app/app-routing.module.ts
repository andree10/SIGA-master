import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Home
import { HomePage } from './pages/home/home';
import { DucaRgComponent } from './pages/duca/duca-rg/duca-rg.component';
//import { EmpresasComponent } from './pages/empresas/EmpresasComponent';

// Error
import { ErrorPage } from './pages/error/error';
import { LoginPage } from './pages/login/login';
import { EmpresasComponent } from './pages/admin/empresas/empresas.component';
import { UsuarioComponent } from './pages/admin/empresas/usuarios/usuarios.component'; // <- CAMBIO

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: LoginPage, data: { title: 'Inicio'} },
  { path: 'home', component: HomePage, data: { title: 'Home'} },
  { path: 'duca-rg', component: DucaRgComponent, data: { title: 'DUCA'} },
  { path: 'empresas', component: EmpresasComponent, data: { title: 'Administración'} },
  { path: 'usuarios', component: UsuarioComponent, data: { title: 'Usuarios'} }, // <- CAMBIO
  { path: '**', component: ErrorPage, data: { title: '404 Error'} }
];

@NgModule({
  imports: [ CommonModule, RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }

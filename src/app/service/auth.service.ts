import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  // ✅ Cargar usuario desde sessionStorage o localStorage
  private loadUserFromStorage() {
    const storedUser = sessionStorage.getItem('usuario') || localStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.avatar = this.formatImagePath(parsedUser.avatar);
      parsedUser.logo = this.formatImagePath(parsedUser.logo);
      this.userSubject.next(parsedUser);
    }
  }

  // ✅ Guardar usuario en sessionStorage (se borra al cerrar el navegador)
  setUser(userData: any, rememberMe: boolean = false) {
    userData.avatar = this.formatImagePath(userData.avatar);
    userData.logo = this.formatImagePath(userData.logo);

    if (rememberMe) {
      localStorage.setItem('usuario', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('usuario', JSON.stringify(userData));
    }

    this.userSubject.next(userData); // Notifica cambios
  }

  // ✅ Obtener usuario como Observable
  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  login(usuario: any) {
	sessionStorage.setItem("usuario", JSON.stringify(usuario));
  }
  getUsuario() {
	return JSON.parse(sessionStorage.getItem("usuario") || "null");
  }

  // ✅ Verificar si hay usuario autenticado
  isAuthenticated(): boolean {
	const usuario = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
	console.log("🔍 Usuario encontrado en storage:", usuario); // <-- Agregamos esto para depurar
	return usuario !== null;
  }
  

  // ✅ Cerrar sesión
  logout() {
    sessionStorage.removeItem('usuario');
    localStorage.removeItem('usuario');
    this.userSubject.next(null);
    this.router.navigate(['/inicio']); // Redirigir al inicio
  }

  // ✅ Convertir ruta relativa de imagen en absoluta
  private formatImagePath(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) {
      return path; // Si ya es una URL completa, la dejamos igual
    }
    return `assets/${path.replace(/^assets\//, '')}`; // Asegura la estructura
  }
}


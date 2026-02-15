
/*  */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private sucursalesSource = new BehaviorSubject<any[]>([
    { id: 1, nombre: 'Sucursal Centro', direccion: 'Centro 123' },
    { id: 2, nombre: 'Sucursal Norte', direccion: 'Norte 456' }
    // Aquí puedes agregar las que tengas guardadas
  ]);

  sucursales$ = this.sucursalesSource.asObservable();

  getSucursales(): Observable<any[]> {
    return this.sucursales$;
  }

  agregarSucursal(sucursal: any) {
    const actuales = this.sucursalesSource.getValue();
    this.sucursalesSource.next([...actuales, sucursal]);
  }
}

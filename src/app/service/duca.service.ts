import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DucaService {
  private apiUrl = 'http://localhost:3000/api/duca';

  constructor(private http: HttpClient) {}

  crearDuca(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, dto);
  }

  generarXml(iddtInt: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/dat-dec/${iddtInt}`);
  }

  guardarDuca(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar`, dto);
  }

  enviarDuca(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar`, dto);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pacient } from '../models/pacient';

@Injectable({
  providedIn: 'root'
})
export class PacientService {
  private apiUrl = 'http://localhost:8080/pacientes'; // URL base do endpoint

  constructor(private http: HttpClient) {}

  getPacients(): Observable<Pacient[]> {
    return this.http.get<Pacient[]>(this.apiUrl); // Endpoint para listar todos os pacientes
  }

  getPacientByCpf(cpf: string): Observable<Pacient> {
    return this.http.get<Pacient>(`${this.apiUrl}/buscar-por-cpf?cpf=${cpf}`);
  }

  getPacientByName(name: string): Observable<Pacient> {
    return this.http.get<Pacient>(`${this.apiUrl}/buscar-por-nome?name=${name}`);
  }

  addPacient(paciente: Pacient): Observable<Pacient> {
    return this.http.post<Pacient>(`${this.apiUrl}/criar`, paciente);
  }

  updatePacient(cpf: string, paciente: Pacient): Observable<Pacient> {
    return this.http.put<Pacient>(`${this.apiUrl}/atualizar/${cpf}`, paciente);
  }

  deletePacient(cpf: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${cpf}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prescription } from '../models/prescription';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:8080/prescricoes'; // URL base do endpoint

  constructor(private http: HttpClient) {}

  getPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.apiUrl)
  }

  getPrescriptionByNumero(numero: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/${numero}`).pipe(
      map((data: Prescription) => {
        if (data) {
          return data;
        }
        throw new Error('Prescrição não encontrada');
      })
    );
  }

  addPrescription(prescricao: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, prescricao).pipe(
      map((data: Prescription) => {
        if (data) {
          return data;
        }
        throw new Error('Erro ao salvar prescrição');
      })
    );
  }

  updatePrescription(numero: number, prescription: Prescription): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${numero}`, prescription).pipe(
      map((data: Prescription) => {
        if (data) {
          return data;
        }
        throw new Error('Erro ao atualizar prescrição');
      })
    );
  }

  concludePrescription(numero: string): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${numero}/concluir`, {}).pipe(
      map((data: Prescription) => {
        if (data) {
          return data;
        }
        throw new Error('Erro ao concluir prescrição');
      })
    );
  }

  listPrescriptionsAtrasadas(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/atrasadas`).pipe(
      map((data: Prescription[]) => data || [])
    );
  }
}

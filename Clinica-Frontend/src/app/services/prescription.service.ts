import { Prescription } from './../models/prescription';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:8080/prescricoes'; // URL base do endpoint

   constructor(private http: HttpClient) {}

   getPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.apiUrl);
  }

  getPrescriptionByNumero(number: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/${number}`);
  }

  addPrescription(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, prescription);
  }

  updatePrescription(number: number, prescription: Prescription): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${number}`, prescription);
  }

  deletePrescription(number: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${number}`);
  }
}

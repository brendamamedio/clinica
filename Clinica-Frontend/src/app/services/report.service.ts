import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/prescription';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/relatorios';

  constructor(private http: HttpClient) {}

  generateReport(prescriptionId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/prescricao/${prescriptionId}`, { responseType: 'blob' });
  }
}

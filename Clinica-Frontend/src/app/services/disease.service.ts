import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disease } from '../models/disease';

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {
  private apiUrl = 'http://localhost:8080/api/doencas';

  constructor(private http: HttpClient) {}

  getDiseases(): Observable<Disease[]> {
    return this.http.get<Disease[]>(this.apiUrl);
  }

  getDisease(cid: string): Observable<Disease> {
    return this.http.get<Disease>(`${this.apiUrl}/buscar/${cid}`);
  }

  addDisease(disease: Disease): Observable<Disease> {
    return this.http.post<Disease>(`${this.apiUrl}/criar`, disease);
  }

  updateDisease(cid: string, disease: Disease): Observable<Disease> {
    return this.http.put<Disease>(`${this.apiUrl}/atualizar/${cid}`, disease);
  }

  deleteDisease(cid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${cid}`);
  }
}

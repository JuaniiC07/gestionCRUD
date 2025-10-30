import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private baseUrl = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) {}

  create(res: Reservation): Observable<Reservation> {
    const payload = { ...res, createdAt: new Date().toISOString() };
    return this.http.post<Reservation>(this.baseUrl, payload);
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

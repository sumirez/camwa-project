import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/api/attendance`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAttendanceRequestsByLecturerId(lecturerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lecturer/${lecturerId}`, { headers: this.getAuthHeaders() });
  }

  getAttendanceByClassIds(classIds: string[]): Observable<any> {
    const ids = classIds.join(',');
    return this.http.get<any>(`${this.apiUrl}/view?classIds=${ids}`, { headers: this.getAuthHeaders() });
  }
}
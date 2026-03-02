// student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = `${environment.apiUrl}/api/students`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<any[]> {
    const res = this.http.get<any[]>(this.apiUrl);
    console.log(res);
    return res;
  }
}

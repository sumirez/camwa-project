import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/logout`, { userId }, { headers });
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return localStorage.getItem('role');
  }

  getDefaultRoute(): string {
    const role = this.getRole();
    switch(role) {
      case 'ADMIN':
        return '/module-view-admin';
      case 'FACULTY':
        return '/module-view-fa';
      case 'LECTURER':
        return '/module-view-lecturer';
      case 'STUDENT':
        return '/module-view-student';
      default:
        return '/login';
    }
  }
}

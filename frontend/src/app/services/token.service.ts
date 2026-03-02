import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  uid: string;
  email: string;
  role: string;
  username: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  getDecodedToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode<JwtPayload>(token);
    }
    return null;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3001/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { user_ultimatix: string, user_password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.API_URL}/me`, { headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ILoginRequest, ILoginResponse } from '../../Models/iuser';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  // BehaviorSubject to track the login state
  private isloggedIn = new BehaviorSubject<boolean>(
    localStorage.getItem('token') !== null
  );
  constructor(private httpClient:HttpClient){

  }
  // Observable to expose the login state.
  isAuthenticated$ =
     this.isloggedIn.asObservable();

  login(credentials: ILoginRequest):Observable<ILoginResponse>{
    return this.httpClient.post<ILoginResponse>('https://localhost:7266/api/auth/Login', credentials)
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('expiresIn', response.expiresIn.toString());
        this.isloggedIn.next(true);
      }));
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    this.isloggedIn.next(false);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded['role'] ?? null;
  } catch {
    return null;
  }
}

isInstructorOrAdmin(): boolean {
  const role = this.getRole();
  return role === 'Instructor' || role === 'Admin';
}
}

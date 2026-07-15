import { jwtDecode } from 'jwt-decode';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClientService } from '../Services/HttpService/http-client-service';
import { inject } from '@angular/core/primitives/di';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const HttpClient = inject(HttpClientService); 
  const router = inject(Router);
  const token = HttpClient.getToken();

  if (token) {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (!isExpired) return true;
    } catch {
      // malformed token, fall through to redirect
    }
  }

  HttpClient.logout();
  router.navigate(['/login']);
  return false;
};

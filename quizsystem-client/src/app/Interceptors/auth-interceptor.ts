import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClientService } from '../Services/HttpService/http-client-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const httpClientService = inject(HttpClientService);
  const token = httpClientService.getToken();
  const isOwnApi = req.url.startsWith('https://localhost:7266');

    // Only add the Authorization header for requests to your own API 
    // Because you don't want to send the token to external APIs. 
    // this is a security measure to prevent token leakage.
  if (token && isOwnApi) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};

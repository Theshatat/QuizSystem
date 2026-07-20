import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClientService } from '../../Services/HttpService/http-client-service';

export const instructorGuardGuard: CanActivateFn = (route, state) => {
  const auth =inject(HttpClientService);
  const router = inject(Router)
  if(auth.isInstructorOrAdmin()){
    return true;
  }
  router.navigate(['/home']);
  return false;
};

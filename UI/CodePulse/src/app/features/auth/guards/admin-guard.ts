import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  const user = authService.user();

  if(!user){
    router.navigate(['/login']);
    return false;
  }

  const isWriter = user.roles.includes("writer");

  if(!isWriter) {
    authService.logout();
    return false;
  }

  return true;
};

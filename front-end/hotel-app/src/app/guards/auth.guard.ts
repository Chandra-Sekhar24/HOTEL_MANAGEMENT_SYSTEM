import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      // Clear any cached data and redirect to login
      this.authService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }

    // If route declares allowed roles, enforce them
    const allowedRoles: string[] | undefined = route.data && (route.data['roles'] as string[] | undefined);
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = this.authService.getRole();
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect user to their own dashboard
        switch (userRole) {
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
            break;
          case 'MANAGER':
            this.router.navigate(['/manager/dashboard'], { replaceUrl: true });
            break;
          case 'RECEPTIONIST':
            this.router.navigate(['/receptionist/dashboard'], { replaceUrl: true });
            break;
          default:
            this.router.navigate(['/login'], { replaceUrl: true });
        }
        return false;
      }
    }

    return true;
  }
}

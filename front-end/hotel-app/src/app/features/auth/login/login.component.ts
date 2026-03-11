import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/staff';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private api = inject(CatalogService);
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  error = '';
  loading = false;

  login() {
    this.loading = true;
    this.error = '';

    // Trim inputs to avoid hidden whitespace issues
    this.credentials = {
      username: this.credentials.username?.trim() || '',
      password: this.credentials.password?.trim() || ''
    };

    // Temporary mock authentication for testing
    if (this.credentials.username === 'admin' && this.credentials.password === 'admin@123') {
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          name: 'Admin',
          email: 'admin@hotel.com',
          phone: '1234567890',
          role: 'ADMIN' as const,
          hotelId: undefined,
          status: 'ACTIVE' as const,
          username: 'admin'
        },
        role: 'ADMIN'
      };

      this.authService.login(mockResponse.user, mockResponse.token, mockResponse.role);
      this.router.navigate(['/admin/dashboard']);
      this.loading = false;
      return;
    }

    // Try real API call
    this.api.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.login(response.user, response.token, response.role);
        
        // Redirect based on role
        switch (response.role) {
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'MANAGER':
            this.router.navigate(['/manager/dashboard']);
            break;
          case 'RECEPTIONIST':
            this.router.navigate(['/receptionist/dashboard']);
            break;
          default:
            this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        
        // If API fails, try mock authentication as fallback
        if (this.credentials.username === 'admin' && this.credentials.password === 'admin@123') {
          const mockResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              name: 'Admin User',
              email: 'admin@hotel.com',
              phone: '1234567890',
              role: 'ADMIN' as const,
              hotelId: undefined,
              status: 'ACTIVE' as const,
              username: 'admin'
            },
            role: 'ADMIN'
          };

          this.authService.login(mockResponse.user, mockResponse.token, mockResponse.role);
          this.router.navigate(['/admin/dashboard']);
          this.loading = false;
          return;
        }
        
        this.error = (err?.error && typeof err.error === 'string') ? err.error : 'Invalid username or password';
        this.loading = false;
      }
    });
  }
}


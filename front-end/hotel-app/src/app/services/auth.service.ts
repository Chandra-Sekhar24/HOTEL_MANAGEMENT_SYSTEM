import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff } from '../models/staff';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Staff | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getCurrentUser(): Staff | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  login(user: Staff, token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
    this.currentUserSubject.next(user);
    
    // Remove the popstate listener when logging in
    window.removeEventListener('popstate', this.preventBackNavigation);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
    
    // Clear browser history to prevent back button access
    window.history.replaceState(null, '', '/login');
    window.history.pushState(null, '', '/login');
    
    // Add event listener to prevent back navigation
    window.addEventListener('popstate', this.preventBackNavigation);
  }

  private preventBackNavigation = (event: PopStateEvent) => {
    // Prevent going back to authenticated pages
    if (!this.isLoggedIn()) {
      window.history.pushState(null, '', '/login');
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }

  isReceptionist(): boolean {
    return this.getRole() === 'RECEPTIONIST';
  }

  // Cleanup method to remove event listeners
  cleanup(): void {
    window.removeEventListener('popstate', this.preventBackNavigation);
  }
}



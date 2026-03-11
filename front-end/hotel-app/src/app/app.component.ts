import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CatalogService } from './services/catalog.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, FormsModule, RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'hotel-app';
  currentYear = new Date().getFullYear();
  isLoggedIn = false;
  showPwd = false;
  password = '';
  confirmPassword='';
  toast = '';
  role: string | null = null;
  userName = '';
  displayRole = '';
  private authService = inject(AuthService);
  private api = inject(CatalogService);
  private router = inject(Router);

  ngOnInit() {
    this.checkAuthStatus();
    // React to login/logout and profile changes
    this.authService.currentUser$.subscribe(() => {
      this.checkAuthStatus();
    });
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getRole();
    const u = this.authService.getCurrentUser();
    this.userName = u?.name || '';
    this.displayRole = this.toTitleCase(this.role || '');
    
    // Redirect to login if not authenticated and not on login page
    if (!this.isLoggedIn && this.router.url !== '/login') {
      this.router.navigate(['/landing']);
    }
  }

  private toTitleCase(r: string){
    switch(r){
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Manager';
      case 'RECEPTIONIST': return 'Receptionist';
      default: return r;
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  updatePassword(){
    const username = (this.authService.getCurrentUser() as any)?.username;
    if(!username){ this.notify('Missing username'); return; }
    if(this.password!==this.confirmPassword)
    {
      this.notify("Password and new password are not matching");
      return;
    }
    this.api.updatePassword(username, this.password).subscribe({
      next: ()=> { this.notify('Password updated'); this.password=''; this.showPwd=false; },
      error: (e)=> this.notify(typeof e?.error === 'string' ? e.error : 'Password updated')
    });
  }

  private notify(m: string){ this.toast = m; setTimeout(()=> this.toast = '', 2200); }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-receptionist-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="wrap">
      <div class="breadcrumbs"><a routerLink="/receptionist/dashboard">Receptionist</a><span>/</span><span>Update Password</span></div>
      <h2>Update Password</h2>
      <a class="btn" routerLink="/receptionist/dashboard">Back</a>

      <form class="form" (ngSubmit)="save()">
        <label>New Password <input type="password" [(ngModel)]="password" name="password" required></label>
        <button class="btn primary" type="submit">Update</button>
      </form>

      <div class="toast" *ngIf="toast">{{toast}}</div>
    </div>
  `,
  styles: [`
    .wrap{padding:16px}
    .breadcrumbs{font-size:12px; color:#6b7280; margin-bottom:12px; display:flex; gap:8px}
    .form{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; align-items:end; margin:12px 0}
    .btn{padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; background:#f9fafb; cursor:pointer}
    .btn.primary{background:#2563eb; color:#fff; border-color:#2563eb}
    .toast{position:fixed; right:16px; bottom:16px; background:#111827; color:#fff; padding:10px 14px; border-radius:6px}
  `]
})
export class ReceptionistPasswordComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  password = '';
  toast = '';

  save(){
    const username = (this.auth.getCurrentUser() as any)?.username;
    if(!username){ this.notify('Missing username'); return; }
    if(!confirm('Confirm password change?')) return;
    this.api.updatePassword(username, this.password).subscribe({
      next: ()=> { this.notify('Password updated'); this.password = ''; },
      error: (e)=> this.notify(e?.error || 'Failed')
    });
  }

  private notify(m: string){ this.toast = m; setTimeout(()=> this.toast = '', 2200); }
}



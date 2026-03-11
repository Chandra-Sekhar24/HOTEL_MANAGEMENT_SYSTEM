import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-receptionist-room-status',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="wrap">
      <div class="breadcrumbs"><a routerLink="/receptionist/dashboard">Receptionist</a><span>/</span><span>Room Status Update</span></div>
      <h2>Room Status Update</h2>
      <a class="btn" routerLink="/receptionist/dashboard">Back</a>

      <form class="form" (ngSubmit)="save()">
        <label>Room Id <input type="number" [(ngModel)]="roomId" name="roomId" required></label>
        <label>Status
          <select [(ngModel)]="status" name="status" required>
            <option>AVAILABLE</option>
            <option>MAINTENANCE</option>
            <option>BOOKED</option>
          </select>
        </label>
        <button class="btn" type="submit">Save</button>
      </form>

      <div class="toast" *ngIf="toast">{{toast}}</div>
    </div>
  `,
  styles: [`
    .wrap{padding:16px}
    .breadcrumbs{font-size:12px; color:#6b7280; margin-bottom:12px; display:flex; gap:8px}
    .form{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; align-items:end; margin:12px 0}
    .btn{padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; background:#f9fafb; cursor:pointer}
    .toast{position:fixed; right:16px; bottom:16px; background:#111827; color:#fff; padding:10px 14px; border-radius:6px}
  `]
})
export class ReceptionistRoomStatusComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  hotelId = this.auth.getCurrentUser()?.hotel?.id || (this.auth.getCurrentUser() as any)?.hotelId;
  roomId?: number;
  status: 'AVAILABLE'|'MAINTENANCE'|'BOOKED' = 'AVAILABLE';
  toast='';

  save(){
    if(!this.hotelId){ this.notify('Missing hotel'); return; }
    if(!this.roomId){ this.notify('Room id required'); return; }
    if(!confirm(`Change room ${this.roomId} status to ${this.status}?`)) return;
    this.api.updateRoomStatusByReceptionist(this.hotelId, Number(this.roomId), this.status)
      .subscribe({ next: ()=> this.notify('Updated'), error: (e)=> this.notify(e?.error || 'Failed') });
  }

  private notify(m: string){ this.toast = m; setTimeout(()=> this.toast = '', 2200); }
}



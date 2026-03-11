import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manager-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bookings-container">
      <!-- Breadcrumbs -->
      <div class="breadcrumbs">
        <a routerLink="/manager/dashboard"><i class="fa-solid fa-house"></i> Manager</a>
        <span>/</span>
        <span>Bookings</span>
      </div>

      <!-- Header -->
      <div class="header">
        <h2><i class="fa-solid fa-clipboard-list"></i> Bookings Overview</h2>
      </div>

      <!-- Filters -->
      <div class="filters card">
        <label><i class="fa-solid fa-calendar-day"></i> Date From 
          <input type="date" [(ngModel)]="from" >
        </label>
        <label><i class="fa-solid fa-calendar-check"></i> Date To 
          <!-- Checkout min = from if chosen, else today -->
          <input type="date" [(ngModel)]="to" >
        </label>
        <label><i class="fa-solid fa-filter"></i> Status
          <select [(ngModel)]="status">
            <option value="">All</option>
            <option value="BOOKED">Booked</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
        <button class="btn primary" (click)="load()"><i class="fa-solid fa-check"></i> Apply</button>
        <a class="btn back" routerLink="/manager/dashboard"><i class="fa-solid fa-arrow-left"></i> Back</a>
      </div>

      <!-- Table -->
      <div class="card table-wrap" *ngIf="items.length; else empty">
        <table class="table">
          <thead>
            <tr>
              <th><i class="fa-solid fa-user"></i> Guest</th>
              <th><i class="fa-solid fa-barcode"></i> Code</th>
              <th><i class="fa-solid fa-bed"></i> Room</th>
              <th><i class="fa-solid fa-sign-in-alt"></i> Check-in</th>
              <th><i class="fa-solid fa-sign-out-alt"></i> Check-out</th>
              <th><i class="fa-solid fa-circle-info"></i> Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of items">
              <td>{{b.guestName}}</td>
              <td>{{b.bookingCode}}</td>
              <td>{{b.room?.roomNumber}}</td>
              <td>{{b.checkInTime | date:'shortDate'}}</td>
              <td>{{b.checkOutTime | date:'shortDate'}}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'success': b.status==='BOOKED' || b.status==='CHECKED_IN',
                  'info': b.status==='CHECKED_OUT',
                  'warn': b.status==='CANCELLED'
                }">{{b.status}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <ng-template #empty>
        <div class="empty"><i class="fa-solid fa-circle-info"></i> No bookings found.</div>
      </ng-template>

      <!-- Toast -->
      <div class="toast" *ngIf="toast">
        <i class="fa-solid fa-bell"></i> {{toast}}
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      padding: 2rem;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .breadcrumbs {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #222;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }

    /* Filters */
    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      align-items: end;
    }

    .filters label {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
      color: #444;
      gap: 0.3rem;
    }

    input, select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    /* Buttons */
    .btn {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }

    .btn.primary {
      background: #3f51b5;
      color: #fff;
    }
    .btn.primary:hover { background: #2e3b91; }

    .btn.back {
      background: #9e9e9e;
      color: #fff;
    }
    .btn.back:hover { background: #616161; }

    /* Table card */
    .card {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .table-wrap {
      overflow: auto;
      max-height: 500px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      text-align: left;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #333;
    }

    tbody tr:hover {
      background: #f1f5ff;
      transition: background 0.2s ease;
    }

    /* Badges */
    .badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
    }
    .badge.success { background: #d4edda; color: #155724; }
    .badge.info { background: #d1ecf1; color: #0c5460; }
    .badge.warn { background: #f8d7da; color: #721c24; }

    /* Empty state */
    .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1rem;
    }

    /* Toast */
    .toast {
      position: fixed;
      right: 20px;
      bottom: 20px;
      background: #111827;
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ManagerBookingsComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);

  hotelId = this.auth.getCurrentUser()?.hotel?.id || (this.auth.getCurrentUser() as any)?.hotelId;
  from = '';
  to = '';
  status = '';
  items: any[] = [];
  toast = '';
  today: string = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  private toIsoStart(d: string) {
    return d ? new Date(d + 'T00:00:00').toISOString()
             : new Date(new Date().setDate(new Date().getDate()-7)).toISOString();
  }

  private toIsoEnd(d: string) {
    return d ? new Date(d + 'T23:59:59').toISOString()
             : new Date().toISOString();
  }

  load() {
    if(!this.hotelId){ this.notify('Missing hotel'); return; }
    this.api.searchBookings(
      this.hotelId, 
      this.toIsoStart(this.from), 
      this.toIsoEnd(this.to), 
      this.status || undefined
    ).subscribe({
      next: d => this.items = d,
      error: ()=> this.notify('Failed to load bookings')
    });
  }

  ngOnInit(){ this.load(); }

  private notify(m: string) {
    this.toast = m; 
    setTimeout(()=> this.toast = '', 2200);
  }
}

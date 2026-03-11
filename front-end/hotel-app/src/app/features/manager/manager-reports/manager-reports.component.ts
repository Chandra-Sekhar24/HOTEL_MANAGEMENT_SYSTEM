import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manager-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="wrap">
      <div class="breadcrumbs"><a routerLink="/manager/dashboard">Manager</a><span>/</span><span>Reports</span></div>
      <h2>Reports</h2>
      <div class="filters">
        <label>Type
          <select [(ngModel)]="type">
            <option value="OCCUPANCY">Occupancy</option>
            <option value="REVENUE">Revenue</option>
          </select>
        </label>
        <label>Date From <input type="date" [(ngModel)]="from"></label>
        <label>Date To <input type="date" [(ngModel)]="to"></label>
        <button class="btn" (click)="load()">Generate</button>
        <a class="btn" routerLink="/manager/dashboard">Back</a>
      </div>
      <div class="card" *ngIf="rows.length; else empty">
        <table>
          <thead>
            <tr *ngIf="type==='OCCUPANCY'"><th>Date</th><th>Total Rooms</th><th>Booked</th><th>Occupancy</th></tr>
            <tr *ngIf="type!=='OCCUPANCY'"><th>Date</th><th>Bookings</th><th>Est. Revenue</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rows">
              <td>{{r.date}}</td>
              <td *ngIf="type==='OCCUPANCY'">{{r.totalRooms}}</td>
              <td *ngIf="type==='OCCUPANCY'">{{r.booked}}</td>
              <td *ngIf="type==='OCCUPANCY'">{{r.occupancy | number:'1.0-0'}}%</td>
              <td *ngIf="type!=='OCCUPANCY'">{{r.bookings}}</td>
              <td *ngIf="type!=='OCCUPANCY'">{{r.revenue | currency}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ng-template #empty><div class="muted">No data for selected range.</div></ng-template>
    </div>
  `
})
export class ManagerReportsComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  hotelId = this.auth.getCurrentUser()?.hotel?.id || (this.auth.getCurrentUser() as any)?.hotelId;
  type = 'OCCUPANCY';
  from = '';
  to = '';
  rows: any[] = [];

  private toIsoStart(d: string){ return d ? new Date(d + 'T00:00:00').toISOString() : new Date(new Date().setDate(new Date().getDate()-7)).toISOString(); }
  private toIsoEnd(d: string){ return d ? new Date(d + 'T23:59:59').toISOString() : new Date().toISOString(); }

  load(){
    if(!this.hotelId) return;
    const from = this.toIsoStart(this.from);
    const to = this.toIsoEnd(this.to);
    // Approximate reports using existing endpoints; replace with real service when ready
    this.api.searchBookings(this.hotelId, from, to, undefined).subscribe({
      next: (data: any[]) => {
        if(this.type === 'OCCUPANCY'){
          const totalRoomsPromise = this.api.rooms(this.hotelId).toPromise();
          totalRoomsPromise?.then(totalRoomsList => {
            const total = (totalRoomsList as any[])?.length || 0;
            const byDate: Record<string, number> = {};
            for(const b of data){
              const d = new Date(b.checkInTime).toLocaleDateString();
              byDate[d] = (byDate[d]||0) + 1;
            }
            this.rows = Object.entries(byDate).map(([date, booked])=>({ date, totalRooms: total, booked, occupancy: total? (booked as number)/total*100 : 0 }));
          });
        } else {
          const byDate: Record<string, { bookings: number; revenue: number; }> = {};
          for(const b of data){
            const d = new Date(b.checkInTime).toLocaleDateString();
            byDate[d] = byDate[d] || { bookings: 0, revenue: 0 };
            byDate[d].bookings++;
            byDate[d].revenue += 100; // placeholder per booking
          }
          this.rows = Object.entries(byDate).map(([date, v])=>({ date, ...(v as any) }));
        }
      },
      error: ()=> { this.rows = []; }
    });
  }

  ngOnInit(){ this.load(); }
} 
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-receptionist-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="wrap">
      <div class="breadcrumbs"><a routerLink="/receptionist/dashboard">Receptionist</a><span>/</span><span>Booking Management</span></div>
      <h2>Booking Management</h2>
      <a class="btn" routerLink="/receptionist/dashboard">Back</a>

      <h3>Available Rooms</h3>
      <form class="add" (ngSubmit)="loadAvailable()">
        <label>Room Type Id <input type="number" [(ngModel)]="form.roomTypeId" name="roomTypeId" required></label>
        <button class="btn" type="submit">Load Available</button>
      </form>
      <div class="table-wrap" *ngIf="available.length">
        <table>
          <thead><tr><th>Room Id</th><th>Room Number</th><th>Type Id</th><th>Status</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of available">
              <td>{{r.id}}</td>
              <td>{{r.roomNumber}}</td>
              <td>{{r.roomType?.id}}</td>
              <td>{{r.status}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Create Booking</h3>
      <form class="add" (ngSubmit)="add()">
        <label>Guest Name<input type="text" [(ngModel)]="form.guestName" name="guestName" required></label>
        <label>Room Type Id <input type="number" [(ngModel)]="form.roomTypeId" name="roomTypeId " disabled></label>
        <label>Check-in Date <input type="date" [min]="today" [(ngModel)]="form.checkInDate" name="checkInDate" required></label>
        <label>Check-out Date <input type="date" [min]="tomorrow" [(ngModel)]="form.checkOutDate" name="checkOutDate" required></label>
        <button class="btn primary" type="submit">Create</button>
        <div class="note">Only succeeds if an AVAILABLE room exists for the type.</div>
      </form>

      <div class="toast" *ngIf="toast">{{toast}}</div>
    </div>
  `,
  styles: [`
    .wrap{padding:16px}
    .breadcrumbs{font-size:12px; color:#6b7280; margin-bottom:12px; display:flex; gap:8px}
    .btn{padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; background:#f9fafb; cursor:pointer; margin:8px 0}
    .btn.primary{background:#2563eb; color:#fff; border-color:#2563eb}
    .btn.success{background:#16a34a; color:#fff; border-color:#16a34a}
    .filters,.add{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; align-items:end; margin:12px 0}
    .table-wrap{overflow:auto; max-height:420px; border:1px solid #e5e7eb; border-radius:6px}
    table{width:100%; border-collapse:collapse}
    th,td{padding:8px; border-bottom:1px solid #f3f4f6}
    th{background:#f9fafb; text-align:left}
    .note{font-size:12px; color:#6b7280}
    .toast{position:fixed; right:16px; bottom:16px; background:#111827; color:#fff; padding:10px 14px; border-radius:6px}
  `]
})
export class ReceptionistBookingManagementComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  today:string=new Date().toISOString().split('T')[0];
  tomorrowDate:Date = new Date(); // Create a new Date object for the current date and time
  getTomorrowDateString = (): string => {
    const today = new Date(); // Get the current date and time
    today.setDate(today.getDate() + 1); // Add one day to the current date
    return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD and return
  };
  
  tomorrow: string = this.getTomorrowDateString();

  hotelId = this.auth.getCurrentUser()?.hotel?.id || (this.auth.getCurrentUser() as any)?.hotelId;
  items: any[] = [];
  available: any[] = [];
  toast = '';
  form: any = { guestName: '', roomTypeId: undefined, checkInDate: '', checkOutDate: '' };

  private iso(s: string){ return new Date(s).toISOString(); }

  loadAvailable(){
    if(!this.hotelId){ this.notify('Missing hotel'); return; }
    if(!this.form.roomTypeId){ this.notify('Enter room type id'); return; }
    this.api.getAvailableRooms(this.hotelId, Number(this.form.roomTypeId))
      .subscribe({ next: d => this.available = d, error: ()=> this.notify('Failed to load available rooms')});
  }

  add(){
    if(!this.hotelId){ this.notify('Missing hotel'); return; }
    const ok = confirm(`Create booking for ${this.form.guestName}?`);
    if(!ok) return;
    this.api.createBooking(
      this.hotelId,
      Number(this.form.roomTypeId),
      {
        guestName: this.form.guestName,
        checkInTime: this.form.checkInDate,
        checkOutTime: this.form.checkOutDate
      }
    ).subscribe({
      next: () => {
  
        const checkIn = new Date(this.form.checkInDate);
        const checkOut = new Date(this.form.checkOutDate);
        const today=new Date();
        if (typeof this.form.guestName === "string" && checkIn < checkOut && checkIn >= today) {
          this.notify("Booking created");
          this.loadAvailable();
        } else {
          this.notify("Invalid booking details: check dates and guest name.");
        }
      },
      error: (e) => this.notify(e?.error || "Creation failed")
    });
  }

  checkIn(b:any){
    if(!confirm(`Confirm check-in for ${b.guestName} (Booking ${b.bookingCode})?`)) return;
    this.api.checkIn(this.hotelId, b.id).subscribe({ next: ()=> { this.notify('Checked in'); this.loadAvailable(); }, error: (e)=> this.notify(e?.error || 'Not allowed') });
  }
  checkOut(b:any){
    if(!confirm(`Confirm check-out for ${b.guestName} (Booking ${b.bookingCode})?`)) return;
    this.api.checkOut(this.hotelId, b.id).subscribe({ next: ()=> { this.notify('Checked out'); this.loadAvailable(); }, error: (e)=> this.notify(e?.error || 'Not allowed') });
  }

  private notify(m: string){ this.toast = m; setTimeout(()=> this.toast = '', 2200); }
}



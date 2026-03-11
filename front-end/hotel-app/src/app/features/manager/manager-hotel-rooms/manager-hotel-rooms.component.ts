import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manager-hotel-rooms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rooms-container">
      <div class="header">
        <h2><i class="fa-solid fa-bed"></i> Hotel Rooms</h2>
        <div class="toolbar">
         
        </div>
      </div>

      <div class="card table-wrap" *ngIf="rooms && rooms.length; else empty">
        <table class="table">
          <thead>
            <tr>
              <th>RoomTypeId</th>
              
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rooms">
              <td>{{r.id}}</td>
          
              <td>{{r.roomType?.name}}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'success': r.status==='AVAILABLE',
                  'warn': r.status==='MAINTENANCE',
                  'info': r.status==='BOOKED'
                }">{{r.status}}</span>
              </td>
              <td class="actions-cell">
                <button class="btn small edit" (click)="edit(r)">
                  <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="btn small danger" (click)="remove(r)">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #empty>
        <div class="empty">
          <i class="fa-solid fa-circle-info"></i> No rooms found for this hotel.
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .rooms-container {
      padding: 2rem;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #222;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .toolbar {
      display: flex;
      gap: 0.8rem;
    }

    /* Buttons */
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }

    .btn.small {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .btn.primary {
      background: #3f51b5;
      color: #fff;
    }
    .btn.primary:hover { background: #2e3b91; }

    .btn.edit {
      background: #ff9800;
      color: #fff;
    }
    .btn.edit:hover { background: #e68900; }

    .btn.danger {
      background: #e53935;
      color: #fff;
    }
    .btn.danger:hover { background: #c62828; }

    /* Actions cell flexbox */
    .actions-cell {
      display: flex;
      gap: 0.6rem;   /* 👈 space between Edit and Delete */
    }

    /* Card / Table */
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

    /* Status Badges */
    .badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
    }
    .badge.success { background: #d4edda; color: #155724; }
    .badge.warn { background: #f8d7da; color: #721c24; }
    .badge.info { background: #d1ecf1; color: #0c5460; }

    /* Empty State */
    .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1rem;
    }
  `]
})
export class ManagerHotelRoomsComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  
  rooms: any[] = [];
  hotelId?: number;

  constructor() {
    const user = this.auth.getCurrentUser();
    this.hotelId = (user as any)?.hotel?.id || (user as any)?.hotelId;
    if (this.hotelId) {
      this.http.get<any[]>(`${environment.apiBaseUrl}/api/admin/hotels/${this.hotelId}/rooms`)
        .subscribe(r => this.rooms = r);
    }
  }

  gotoAddRoom(){  
    this.router.navigate(['/manager/hotel/rooms/add']);  
  }
  
  edit(r:any){  
    this.router.navigate([`/manager/hotel/rooms/edit/${r.id}`]);  
  }
  
  remove(r:any){
    if(!this.hotelId) return;
    if(confirm('Delete room?')){
      this.http.delete(`${environment.apiBaseUrl}/api/admin/hotels/${this.hotelId}/rooms/${r.id}`)
        .subscribe(()=>{
          this.rooms = this.rooms.filter(x=>x.id!==r.id);
        });
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manager-staff',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="staff-container">
      <div class="header">
        <h2><i class="fa-solid fa-users"></i> Receptionists</h2>
        <div class="toolbar">
          <button class="btn primary" (click)="gotoAddStaff()">
            <i class="fa-solid fa-user-plus"></i> Add Receptionist
          </button>
        </div>
      </div>

      <div class="card table-wrap" *ngIf="staff && staff.length; else empty">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th><i class="fa-solid fa-user"></i> Name</th>
              <th><i class="fa-solid fa-envelope"></i> Email</th>
              <th><i class="fa-solid fa-phone"></i> Phone</th>
              <th><i class="fa-solid fa-toggle-on"></i> Status</th>
              <th><i class="fa-solid fa-cogs"></i> Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of staff">
              <td>{{s.id}}</td>
              <td>{{s.name}}</td>
              <td>{{s.email}}</td>
              <td>{{s.phone}}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'success': s.status==='ACTIVE',
                  'warn': s.status==='INACTIVE'
                }">{{s.status}}</span>
              </td>
              <td class="actions-cell">
                <button class="btn small danger" (click)="remove(s)">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #empty>
        <div class="empty">
          <i class="fa-solid fa-circle-info"></i> No receptionists found for this hotel.
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .staff-container {
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

    .btn.danger {
      background: #e53935;
      color: #fff;
    }
    .btn.danger:hover { background: #c62828; }

    /* Actions cell */
    .actions-cell {
      display: flex;
      gap: 0.6rem;  /* space between buttons */
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

    /* Status badges */
    .badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
    }
    .badge.success { background: #d4edda; color: #155724; }
    .badge.warn { background: #f8d7da; color: #721c24; }

    /* Empty state */
    .empty {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1rem;
    }
  `]
})
export class ManagerStaffComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  
  staff: any[] = [];
  hotelId?: number;

  constructor() {
    const user = this.auth.getCurrentUser();
    this.hotelId = (user as any)?.hotel?.id || (user as any)?.hotelId;
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/admin/staff`).subscribe(list => {
      this.staff = (list||[]).filter(s => s.role === 'RECEPTIONIST' && ((s.hotel?.id)||s.hotelId) === this.hotelId);
    });
  }

  gotoAddStaff(){  
    this.router.navigate(['/manager/staff/add']);  
  }
  
  remove(s:any){
    if(confirm('Delete staff?')){
      this.http.delete(`${environment.apiBaseUrl}/api/admin/staff/${s.id}`).subscribe(()=>{
        this.staff = this.staff.filter(x=>x.id!==s.id);
      });
    }
  }
}

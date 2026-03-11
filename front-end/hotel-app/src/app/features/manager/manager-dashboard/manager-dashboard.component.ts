import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CatalogService } from '../../../services/catalog.service';
import { DataRefreshService } from '../../../services/data-refresh.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent implements OnInit {
  private router = inject(Router);
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  private refresh = inject(DataRefreshService);

  loading = true;
  stats: any = { totalRooms: 0, totalBookings: 0, activeCheckIns: 0, pendingCheckIns: 0, activeStaff: 0 };
  hotelId?: number;
  hotelName = '';

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.hotelId = (user as any)?.hotel?.id || (user as any)?.hotelId;
    this.hotelName = (user as any)?.hotel?.name || '';
    this.loadStats();
    this.refresh.refresh$.subscribe(() => this.loadStats());
  }

  loadStats(){
    if(!this.hotelId) { 
      this.loading = false; 
      return; 
    }
    this.loading = true;
    this.api.getManagerDashboardStats(this.hotelId).subscribe({
      next: (res) => { 
        this.stats = res; 
        this.loading = false; 
      },
      error: () => { 
        this.loading = false; 
      }
    });
  }

  // Method to be called when data changes (rooms/staff added/updated/deleted)
  refreshData() {
    this.loadStats();
  }
}

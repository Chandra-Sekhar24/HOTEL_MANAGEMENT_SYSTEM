import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';
import { DataRefreshService } from '../../../services/data-refresh.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(CatalogService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private refreshService = inject(DataRefreshService);

  stats = {
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    activeCheckIns: 0,
    pendingCheckIns: 0,
    activeStaff: 0
  };

  loading = true;
  error = '';

  ngOnInit() {
    this.loadDashboardStats();
    
    // Listen for refresh triggers
    this.refreshService.refresh$.subscribe(() => {
      this.loadDashboardStats();
    });
  }

  loadDashboardStats() {
    this.loading = true;
    this.api.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
        // Try to get basic stats from hotels and staff APIs
        this.loadBasicStats();
      }
    });
  }

  loadBasicStats() {
    // Get hotels count
    this.api.hotels().subscribe({
      next: (hotels) => {
        this.stats.totalHotels = hotels.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Hotels API error:', err);
        this.stats.totalHotels = 0;
        this.loading = false;
      }
    });

    // Get staff count (both managers and receptionists)
    this.api.getStaff().subscribe({
      next: (staff) => {
        this.stats.activeStaff = staff.length; // All staff are active
      },
      error: (err) => {
        console.error('Staff API error:', err);
        this.stats.activeStaff = 0;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { Staff } from '../../../models/staff';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit {
  private api = inject(CatalogService);

  staff: Staff[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.api.getStaff().subscribe({
      next: (data) => {
        this.staff = data;
        this.loading = false;
      },
      error: (err) => {
        // Show empty array instead of error
        this.staff = [];
        this.loading = false;
        console.error('Staff error:', err);
      }
    });
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this staff member?')) {
      const staff = this.staff.find(s => s.id === id);
      this.api.deleteStaff(id).subscribe({
        next: () => {
          this.staff = this.staff.filter(s => s.id !== id);
        },
        error: (err) => {
          alert('Error deleting staff: ' + err.message);
        }
      });
    }
  }

}


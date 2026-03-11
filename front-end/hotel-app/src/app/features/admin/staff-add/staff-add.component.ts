import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { Staff } from '../../../models/staff';
import { Hotel } from '../../../models/hotel';
import { DataRefreshService } from '../../../services/data-refresh.service';

@Component({
  selector: 'app-staff-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-add.component.html',
  styleUrl: './staff-add.component.css'
})
export class StaffAddComponent implements OnInit {
  private api = inject(CatalogService);
  private router = inject(Router);
  private refreshService = inject(DataRefreshService);

  formError = '';
  emailError = '';
  phoneError = '';
  loading = false;

  staff: Partial<Staff> = {
    name: '',
    email: '',
    phone: '',
    role: 'MANAGER',
    hotel: undefined,
    hotelId: undefined,
    status: 'ACTIVE'
  };

  availableHotels: Hotel[] = [];
  hotelsLoading = true;

  roles = [
    { value: 'MANAGER', label: 'Manager' },
    { value: 'RECEPTIONIST', label: 'Receptionist' }
  ];

  ngOnInit() {
    this.loadAvailableHotels();
  }

  loadAvailableHotels() {
    this.api.getAvailableHotels().subscribe({
      next: (hotels) => {
        this.availableHotels = hotels;
        this.hotelsLoading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.availableHotels = [];
        this.hotelsLoading = false;
        this.formError = 'Failed to load hotels. Please try again.';
      }
    });
  }

  save() {
    this.loading = true;
    this.formError = '';
    this.emailError = '';
    this.phoneError = '';

    // Validate required fields
    if (!this.staff.name || !this.staff.email || !this.staff.phone) {
      this.formError = 'Please fill in all required fields';
      this.loading = false;
      return;
    }

    // Frontend validation: email and phone
    const emailRx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRx.test((this.staff.email || '').trim())) {
      this.emailError = 'Please enter a valid email (this will be the username)';
      this.loading = false;
      return;
    }
    const phoneRx = /^[6-9][0-9]{9}$/;
    if (!phoneRx.test((this.staff.phone || '').trim())) {
      this.phoneError = 'Enter Valid Mobile Number';
      this.loading = false;
      return;
    }

    // If role is MANAGER or RECEPTIONIST, hotelId is required
    if ((this.staff.role === 'MANAGER' || this.staff.role === 'RECEPTIONIST') && !this.staff.hotelId) {
      this.formError = 'Hotel ID is required for Manager and Receptionist roles';
      this.loading = false;
      return;
    }

    // Format data for API
    const staffData = {
      name: this.staff.name,
      email: this.staff.email,
      phone: this.staff.phone,
      role: this.staff.role,
      hotel: this.staff.hotelId ? { id: this.staff.hotelId } : undefined
    };

    this.api.createStaff(staffData).subscribe({
      next: (response) => {
        // Trigger refresh of all data
        this.refreshService.triggerRefresh();
        alert(`${this.staff.role} created successfully!\nUsername: ${response.username || (this.staff.email || '')}\nPassword: ${response.password || 'Generated'}`);
        this.router.navigate(['/admin/staff']);
        this.loading = false;
      },
      error: (err) => {
        this.formError = err.error?.message || `Failed to create ${this.staff.role}`;
        this.loading = false;
        console.error('Manager creation error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/staff']);
  }
}
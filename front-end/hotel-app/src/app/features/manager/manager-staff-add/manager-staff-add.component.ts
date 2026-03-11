import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { Staff } from '../../../models/staff';
import { DataRefreshService } from '../../../services/data-refresh.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manager-staff-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-staff-add.component.html',
  styleUrl: './manager-staff-add.component.css'
})
export class ManagerStaffAddComponent implements OnInit {
  private api = inject(CatalogService);
  private router = inject(Router);
  private refreshService = inject(DataRefreshService);
  private auth = inject(AuthService);

  formError = '';
  emailError = '';
  phoneError = '';
  loading = false;
  hotelId!: number;
  hotelName = '';

  staff: Partial<Staff> = {
    name: '',
    email: '',
    phone: '',
    role: 'RECEPTIONIST',
    status: 'ACTIVE'
  };

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.hotelId = (user as any)?.hotel?.id || (user as any)?.hotelId;
    this.hotelName = (user as any)?.hotel?.name || 'Your Hotel';
    
    if (!this.hotelId) {
      this.formError = 'No hotel assigned to your account. Please contact administrator.';
      return;
    }
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

    // Frontend validations: email & phone
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

    // Format data for API - automatically set role to RECEPTIONIST and assign to manager's hotel
    const staffData: Partial<Staff> = {
      name: this.staff.name,
      email: this.staff.email,
      phone: this.staff.phone,
      role: 'RECEPTIONIST' as const,
      hotel: { id: this.hotelId }
    };

    this.api.createStaff(staffData).subscribe({
      next: (response) => {
        // Trigger refresh of all data
        this.refreshService.triggerRefresh();
        alert(`Receptionist created successfully!\nUsername: ${response.username || (this.staff.email || '')}\nPassword: ${response.password || 'Generated'}`);
        this.router.navigate(['/manager/staff']);
        this.loading = false;
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to create receptionist';
        this.loading = false;
        console.error('Receptionist creation error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/manager/staff']);
  }
}

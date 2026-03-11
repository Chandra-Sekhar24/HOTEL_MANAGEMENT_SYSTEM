import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { Hotel } from '../../../models/hotel';
import { HttpErrorResponse } from '@angular/common/http';
import { DataRefreshService } from '../../../services/data-refresh.service';

@Component({
  selector: 'app-add-hotel',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.css'
})
export class AddHotelComponent {
  private api = inject(CatalogService);
  private router = inject(Router);
  private refreshService = inject(DataRefreshService);
  formError = '';
  loading = false;

  hotel: Partial<Hotel> = { status: 'ACTIVE' };

  save() {
    this.loading = true;
    this.api.createHotel(this.hotel).subscribe({
      next: () => {
        // Trigger refresh of all data
        this.refreshService.triggerRefresh();
        alert('Hotel created successfully!');
        this.router.navigate(['/admin/hotels']);
        this.loading = false;
      },
      error: (err:HttpErrorResponse) => {
        const serverMsg = typeof err.error === 'string' ? err.error: '';
        if(err.status === 409 && serverMsg) {
          this.formError = serverMsg;
        } else {
          this.formError = 'Could not save hotel. Please try again';
        }
        this.loading = false;
      }
    });
  }
 
  cancel() {
    this.router.navigate(['/hotels']);
  }
}

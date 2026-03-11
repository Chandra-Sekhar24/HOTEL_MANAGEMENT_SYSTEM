import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { DataRefreshService } from '../../../services/data-refresh.service';
import { RoomType } from '../../../models/room-type';

@Component({
  selector: 'app-edit-room-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roomtype-edit.component.html',
  styleUrls: ['./roomtype-edit.component.css']
})
export class EditRoomTypeComponent {
  hotelId!: number;
  roomTypeId!: number;
  formError = '';
  loading = false;

  roomType: RoomType = {
    id: 0,
    name: '',
    maxGuests: 1,
    basePrice: 0,
    hotel: { id: 0 }
  };

  constructor(
    private api: CatalogService,
    private router: Router,
    private route: ActivatedRoute,
    private refreshService: DataRefreshService
  ) {}

  ngOnInit() {
    this.hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
    this.roomTypeId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Load the room type data
    this.loadRoomType();
  }

  loadRoomType() {
    this.api.getRoomTypes(this.hotelId).subscribe({
      next: (roomTypes) => {
        const roomType = roomTypes.find(rt => rt.id === this.roomTypeId);
        if (roomType) {
          this.roomType = { ...roomType };
        } else {
          this.formError = 'Room type not found';
        }
      },
      error: (err) => {
        this.formError = 'Failed to load room type';
        console.error('Error loading room type:', err);
      }
    });
  }

  save() {
    this.loading = true;
    this.formError = '';

    this.api.updateRoomType(this.hotelId, this.roomTypeId, this.roomType).subscribe({
      next: () => {
        this.refreshService.triggerRefresh();
        alert('Room type updated successfully!');
        this.router.navigate(['/admin/hotels', this.hotelId], { queryParams: { tab: 'roomTypes' } });
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        const serverMsg = typeof err.error === 'string' ? err.error : '';
        if (err.status === 409 && serverMsg) {
          this.formError = serverMsg;
        } else {
          this.formError = 'Could not update room type. Please try again';
        }
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/hotels', this.hotelId]);
  }
}

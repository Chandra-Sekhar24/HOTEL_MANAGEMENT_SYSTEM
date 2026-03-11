import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { RoomType } from '../../../models/room-type';
import { DataRefreshService } from '../../../services/data-refresh.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manager-room-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-room-edit.component.html',
  styleUrl: './manager-room-edit.component.css'
})
export class ManagerRoomEditComponent implements OnInit {
  private api = inject(CatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private refreshService = inject(DataRefreshService);
  private auth = inject(AuthService);

  hotelId!: number;
  roomId!: number;
  formError = '';
  loading = false;

  room = {
    roomNumber: '',
    roomTypeId: '' as string,
    status: 'AVAILABLE' as 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED'
  };

  roomTypes: RoomType[] = [];
  roomTypesLoading = true;

  statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'BOOKED', label: 'Booked' }
  ];

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.hotelId = (user as any)?.hotel?.id || (user as any)?.hotelId;
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.hotelId) {
      this.formError = 'No hotel assigned to your account. Please contact administrator.';
      return;
    }
    
    this.loadRoomTypes();
    this.loadRoom();
  }

  loadRoomTypes() {
    this.api.getRoomTypes(this.hotelId).subscribe({
      next: (data) => {
        this.roomTypes = data;
        this.roomTypesLoading = false;
      },
      error: (err) => {
        this.formError = 'Failed to load room types.';
        this.roomTypesLoading = false;
        console.error('Room types error:', err);
      }
    });
  }

  loadRoom() {
    this.api.getRoom(this.hotelId, this.roomId).subscribe({
      next: (data) => {
        this.room = {
          roomNumber: data.roomNumber,
          roomTypeId: data.roomType?.id?.toString() || '',
          status: data.status
        };
      },
      error: (err) => {
        this.formError = 'Failed to load room details.';
        console.error('Room load error:', err);
      }
    });
  }

  save() {
    this.loading = true;
    this.formError = '';

    if (!this.room.roomNumber || !this.room.roomTypeId) {
      this.formError = 'Please fill in all required fields';
      this.loading = false;
      return;
    }

    // Prepare room data for API
    const roomData = {
      roomNumber: this.room.roomNumber,
      roomTypeId: parseInt(this.room.roomTypeId),
      status: this.room.status
    };

    this.api.updateRoom(this.hotelId, this.roomId, roomData).subscribe({
      next: () => {
        // Trigger refresh of all data
        this.refreshService.triggerRefresh();
        alert('Room updated successfully!');
        this.router.navigate(['/manager/hotel']);
        this.loading = false;
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to update room';
        this.loading = false;
        console.error('Room update error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/manager/hotel']);
  }
}

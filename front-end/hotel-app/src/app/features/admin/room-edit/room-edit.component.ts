import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { RoomType } from '../../../models/room-type';
import { Room } from '../../../models/room';

@Component({
  selector: 'app-room-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.css'
})
export class RoomEditComponent implements OnInit {
  private api = inject(CatalogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  hotelId!: number;
  roomId!: number;
  formError = '';
  loading = false;

  room: Room = {
    id: 0,
    hotel: { id: 0 },
    roomType: { id: 0, name: '' },
    roomNumber: '',
    status: 'AVAILABLE'
  };

  roomTypes: RoomType[] = [];
  roomTypesLoading = true;

  statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'BOOKED', label: 'Booked' }
  ];

  ngOnInit() {
    this.hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
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
        this.formError = 'Failed to load room types';
        this.roomTypesLoading = false;
        console.error('Room types error:', err);
      }
    });
  }

  loadRoom() {
    // For now, we'll get the room from the rooms list
    // In a real app, you'd have a getRoomById API
    this.api.rooms(this.hotelId).subscribe({
      next: (rooms) => {
        const room = rooms.find(r => r.id === this.roomId);
        if (room) {
          this.room = room;
        } else {
          this.formError = 'Room not found';
        }
      },
      error: (err) => {
        this.formError = 'Failed to load room data';
        console.error('Room error:', err);
      }
    });
  }

  save() {
    this.loading = true;
    this.formError = '';

    if (!this.room.roomNumber) {
      this.formError = 'Please fill in all required fields';
      this.loading = false;
      return;
    }

    const roomData = {
      roomNumber: this.room.roomNumber,
      roomTypeId: this.room.roomType.id || 0,
      status: this.room.status
    };

    this.api.updateRoom(this.hotelId, this.roomId, roomData).subscribe({
      next: () => {
        alert('Room updated successfully!');
        this.router.navigate(['/admin/hotels', this.hotelId], { queryParams: { tab: 'rooms' } });
      },
      error: (err) => {
        this.formError = err.error?.message || 'Failed to update room';
        this.loading = false;
        console.error('Room update error:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/hotels', this.hotelId], { queryParams: { tab: 'rooms' } });
  }
}

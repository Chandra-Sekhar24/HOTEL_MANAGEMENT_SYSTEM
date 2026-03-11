import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { CatalogService } from '../../../services/catalog.service';
import { Hotel } from '../../../models/hotel';
import { RoomType } from '../../../models/room-type';
import { Room } from '../../../models/room';
 
@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hotel-detail.component.html' ,
  styleUrl: './hotel-detail.component.css'
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(CatalogService);
 
  activeTab: 'roomTypes' | 'rooms' = 'roomTypes'

  hotel!: Hotel;
  hotelId!: number;
 
  
  roomTypes: RoomType[] = [];
  rooms: Room[] = [];
 
  status = '';
 
  typesLoading = true; typesError = '';
  roomsLoading = true; roomsError = '';
 
  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.hotelId = Number(idParam);
      this.loadHotelData();
    } else {
      console.log("Add mode - no hotelId");
    }

    // Check for query parameter to set active tab
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'rooms') {
      this.activeTab = 'rooms';
    }

    // Listen for navigation events to refresh data when returning from add/edit pages
    this.router.events.subscribe(() => {
      const currentId = this.route.snapshot.paramMap.get('id');
      if (currentId && Number(currentId) === this.hotelId) {
        this.loadRoomTypes();
        this.loadRooms();
        
        // Check for query parameter to set active tab on navigation
        const tab = this.route.snapshot.queryParamMap.get('tab');
        if (tab === 'rooms') {
          this.activeTab = 'rooms';
        }
      }
    });
  }

  loadHotelData() {
    this.api.hotelById(this.hotelId).subscribe({
      next: h => this.hotel = h,
      error: e => console.error(e)
    });

    this.loadRoomTypes();
    this.loadRooms();
  }

  loadRoomTypes() {
    this.api.roomTypes(this.hotelId).subscribe({
      next: d => { this.roomTypes = d; this.typesLoading = false; },
      error: e => { 
        // Show empty array instead of error
        this.roomTypes = []; 
        this.typesLoading = false; 
        console.error('Room types error:', e);
      }
    });
  }
 
  loadRooms() {
    this.roomsLoading = true; this.roomsError = '';
    this.api.rooms(this.hotelId, { status: this.status || undefined }).subscribe({
      next: d => { this.rooms = d; this.roomsLoading = false; },
      error: _ => { 
        // Show empty array instead of error
        this.rooms = []; 
        this.roomsLoading = false; 
        console.error('Rooms error:', _);
      }
    });
  }
 
  // crude helper to show type name; in real app fetch by id or include name in room payload
  displayType(roomTypeId?: number) {
    const t = this.roomTypes.find(x => x.id === roomTypeId);
    return t?.name || t?.type || roomTypeId || '-';
  }

  deleteRoom(id: number) {
    if(confirm('Delete room?')) {
      this.api.deleteRoom(this.hotelId, id).subscribe({
        next: () => this.rooms = this.rooms.filter(r => r.id !== id),
        error: (err) => alert('Error deleting room: ' + err.message)
      })
    }
  }

 
  delete(id: number) {
    if (confirm('Delete room type?')) {
      this.api.deleteRoomType(this.hotelId, id).subscribe({
        next: () => this.roomTypes = this.roomTypes.filter(r => r.id !== id),
        error: (err) => {
          if(err.status === 400) {
            alert('Cannot delete this Rom Type because rooms exist for it');
          }
          else{
             alert('Error deleting room type: ' + err.message)
          }
         }
      });
    }
  }
}
 
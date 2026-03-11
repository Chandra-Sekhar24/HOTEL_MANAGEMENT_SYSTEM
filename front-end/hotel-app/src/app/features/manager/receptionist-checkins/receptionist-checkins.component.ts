import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-receptionist-checkins',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl:"./receptionist-checkins.component.html",
  styleUrl:"./receptionist-checkins.component.css" 
})
export class ReceptionistCheckinsComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  items: any[] = [];
  toast = '';
  hotelId = this.auth.getCurrentUser()?.hotel?.id || (this.auth.getCurrentUser() as any)?.hotelId;

  ngOnInit(){ this.load(); }

  load(){
    if(!this.hotelId){ this.notify('Missing hotel'); return; }
    this.api.getTodaysCheckins(this.hotelId).subscribe({ next: d => this.items = d, error: ()=> this.notify('Load failed') });
  }

  checkIn(b: any){
    const ok = confirm(`Confirm check-in for ${b.guestName} (Booking ${b.bookingCode})?`);
    if(!ok) return;
    this.api.checkIn(this.hotelId, b.id).subscribe({ next: ()=> { this.notify('Checked in'); this.load(); }, error: (e)=> this.notify(e?.error || 'Check-in not allowed') });
  }
checkOut(b: any){
  const ok = confirm(`Confirm check-out for ${b.guestName} (Booking ${b.bookingCode})?`);
  if(!ok) return;
  this.api.checkOut(this.hotelId, b.id).subscribe({ next: ()=> { this.notify('Checked out'); this.load(); }, error: (e)=> this.notify(e?.error || 'Check-out not allowed') });
}
cancle(b:any)
{
  const ok = confirm(`Confirm cancle for ${b.guestName} (Booking ${b.bookingCode})?`);
if(!ok) return;
this.api.cancle(this.hotelId, b.id).subscribe({ next: ()=> { this.notify('Canclled'); this.load(); }, error: (e)=> this.notify(e?.error || 'Canclillation not allowed') });
}
  private notify
(m: string){ this.toast = m; setTimeout(()=> this.toast = '', 2200); }
} 

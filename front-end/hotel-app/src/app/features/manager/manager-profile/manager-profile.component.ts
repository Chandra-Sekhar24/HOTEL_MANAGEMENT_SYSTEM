import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manager-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Profile</h2>
    <div *ngIf="user">
      <p><b>Name:</b> {{user.name}}</p>
      <p><b>Email:</b> {{user.email}}</p>
      <p><b>Username:</b> {{user.username}}</p>
      <p><b>Hotel:</b> {{hotelName}}</p>
    </div>
  `
})
export class ManagerProfileComponent {
  private auth = inject(AuthService);
  
  user: any;
  hotelName = '';

  constructor() {
    this.user = this.auth.getCurrentUser();
    this.hotelName = (this.user?.hotel?.name) || '';
  }
}

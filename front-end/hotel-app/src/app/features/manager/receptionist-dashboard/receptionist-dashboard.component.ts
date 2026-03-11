import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl:'./receptionist-dashboard.component.html',
  styleUrl:'./receptionist-dashboard.component.css'
})
export class ReceptionistDashboardComponent {
  private api = inject(CatalogService);
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.getCurrentUser();
  hotelId = this.user?.hotel?.id || (this.user as any)?.hotelId;

}

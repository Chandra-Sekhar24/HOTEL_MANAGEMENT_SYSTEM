import { Routes } from '@angular/router';
import { HotelsListComponent } from './features/admin/hotels-list/hotels-list.component';
import { HotelDetailComponent } from './features/admin/hotel-detail/hotel-detail.component';
import { AddHotelComponent } from './features/admin/add-hotel/add-hotel.component';
import { HotelEditComponent } from './features/admin/hotel-edit/hotel-edit.component';
import { RoomTypeListComponent } from './features/admin/roomtype-list/roomtype-list.component';
import { AddRoomTypeComponent } from './features/admin/roomtype-add/roomtype-add.component';
import { EditRoomTypeComponent } from './features/admin/roomtype-edit/roomtype-edit.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { StaffListComponent } from './features/admin/staff-list/staff-list.component';
import { StaffAddComponent } from './features/admin/staff-add/staff-add.component';
import { RoomAddComponent } from './features/admin/room-add/room-add.component';
import { RoomEditComponent } from './features/admin/room-edit/room-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { ManagerDashboardComponent } from './features/manager/manager-dashboard/manager-dashboard.component';
import { ManagerHotelRoomsComponent } from './features/manager/manager-hotel-rooms/manager-hotel-rooms.component';
import { ManagerStaffComponent } from './features/manager/manager-staff/manager-staff.component';
import { ManagerBookingsComponent } from './features/manager/manager-bookings/manager-bookings.component';
import { ManagerReportsComponent } from './features/manager/manager-reports/manager-reports.component';
import { ManagerProfileComponent } from './features/manager/manager-profile/manager-profile.component';
import { ReceptionistDashboardComponent } from './features/manager/receptionist-dashboard/receptionist-dashboard.component';
import { ReceptionistCheckinsComponent } from './features/manager/receptionist-checkins/receptionist-checkins.component';
import { ReceptionistBookingManagementComponent } from './features/manager/receptionist-booking-management/receptionist-booking-management.component';
import { ReceptionistRoomStatusComponent } from './features/manager/receptionist-room-status/receptionist-room-status.component';
import { ReceptionistPasswordComponent } from './features/manager/receptionist-password/receptionist-password.component';
import { ManagerRoomAddComponent } from './features/manager/manager-room-add/manager-room-add.component';
import { ManagerRoomEditComponent } from './features/manager/manager-room-edit/manager-room-edit.component';
import { ManagerStaffAddComponent } from './features/manager/manager-staff-add/manager-staff-add.component';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    // Admin routes
    {
        path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels', component: HotelsListComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/add', component: AddHotelComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/:id', component: HotelDetailComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/edit/:id', component: HotelEditComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/:hotelId/roomtypes', component: RoomTypeListComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/:hotelId/roomtypes/add', component: AddRoomTypeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/:hotelId/roomtypes/edit/:id', component: EditRoomTypeComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/:hotelId/rooms/add', component: RoomAddComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/hotels/:hotelId/rooms/edit/:id', component: RoomEditComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/staff', component: StaffListComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    {
        path: 'admin/staff/add', component: StaffAddComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] }
    },
    // Legacy routes for backward compatibility
    {
        path: 'hotels', component: HotelsListComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/add', component: AddHotelComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/:id', component: HotelDetailComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/edit/:id', component: HotelEditComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/:hotelId/roomtypes', component: RoomTypeListComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/:hotelId/roomtypes/add', component: AddRoomTypeComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/:hotelId/roomtypes/edit/:id', component: EditRoomTypeComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/:hotelId/rooms/add', component: RoomAddComponent, canActivate: [AuthGuard]
    },
    {
        path: 'hotels/:hotelId/rooms/edit/:id', component: RoomEditComponent, canActivate: [AuthGuard]
    },
    // Default routes
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    // Manager routes
    {
        path: 'manager/dashboard', component: ManagerDashboardComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] }
    },
    { path: 'manager/hotel', component: ManagerHotelRoomsComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/hotel/rooms/add', component: ManagerRoomAddComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/hotel/rooms/edit/:id', component: ManagerRoomEditComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/staff', component: ManagerStaffComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/staff/add', component: ManagerStaffAddComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/bookings', component: ManagerBookingsComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/reports', component: ManagerReportsComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    { path: 'manager/profile', component: ManagerProfileComponent, canActivate: [AuthGuard], data: { roles: ['MANAGER'] } },
    // Receptionist routes
    { path: 'receptionist/dashboard', component: ReceptionistDashboardComponent, canActivate: [AuthGuard], data: { roles: ['RECEPTIONIST'] } },
    { path: 'receptionist/checkins', component: ReceptionistCheckinsComponent, canActivate: [AuthGuard], data: { roles: ['RECEPTIONIST'] } },
    { path: 'receptionist/bookings', component: ReceptionistBookingManagementComponent, canActivate: [AuthGuard], data: { roles: ['RECEPTIONIST'] } },
    { path: 'receptionist/rooms', component: ReceptionistRoomStatusComponent, canActivate: [AuthGuard], data: { roles: ['RECEPTIONIST'] } },
    { path: 'receptionist/password', component: ReceptionistPasswordComponent, canActivate: [AuthGuard], data: { roles: ['RECEPTIONIST'] } },
    {
        path: '**', redirectTo: 'login'
    }
];

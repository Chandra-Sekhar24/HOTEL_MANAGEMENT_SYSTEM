# Hotel Management System - Admin Features

## Overview

This document describes the admin features implemented in the Hotel Management System frontend.

## Features Implemented

### 1. Authentication System

- **Login Component**: Single login page for Admin, Manager, and Receptionist
- **Role-based Redirection**: Users are redirected to appropriate dashboards based on their role
- **Default Admin Credentials**:
  - Username: `admin`
  - Password: `admin@123`

### 2. Admin Dashboard

- **Summary Cards**: Display key metrics including:
  - Total Hotels
  - Total Rooms
  - Current Bookings
  - Active Check-ins
  - Pending Check-ins
  - Active Staff
- **Quick Actions**: Direct links to add hotels and staff
- **Navigation**: Easy access to Hotels and Staff Management

### 3. Hotel Management

- **Hotels List**: View all hotels with search and filter capabilities
- **Add/Edit Hotels**: Create and modify hotel information
- **Hotel Details**: Detailed view with room types and rooms management
- **Room Types Management**: Add, edit, and delete room types for each hotel
- **Rooms Management**: Add, edit, and delete rooms for each hotel

### 4. Staff Management

- **Staff List**: View all staff members with their roles and status
- **Add Staff**: Create new staff accounts with automatic username/password generation
- **Role Assignment**: Assign managers to specific hotels
- **Status Management**: Activate/deactivate staff accounts
- **Validation**: Ensure only one manager per hotel

### 5. Room Management

- **Add Rooms**: Create new rooms with room type assignment
- **Edit Rooms**: Modify room information and status
- **Status Tracking**: Track room availability (Available, Booked, Maintenance)
- **Room Type Integration**: Rooms are linked to specific room types

## Technical Implementation

### Components Created

1. `LoginComponent` - Authentication
2. `AdminDashboardComponent` - Main admin dashboard
3. `StaffListComponent` - Staff management list
4. `StaffAddComponent` - Add new staff members
5. `RoomAddComponent` - Add new rooms
6. `RoomEditComponent` - Edit existing rooms

### Services

1. `AuthService` - Authentication and user management
2. `CatalogService` - Extended with staff and room management APIs

### Models

1. `Staff` - Staff member data structure
2. `LoginRequest/LoginResponse` - Authentication data structures

### Routing

- All admin routes are prefixed with `/admin/`
- Legacy routes maintained for backward compatibility
- Authentication guard implemented

## Usage Instructions

1. **Login**: Navigate to `/login` and use admin credentials
2. **Dashboard**: After login, you'll see the admin dashboard with summary cards
3. **Manage Hotels**: Click "Hotels" to view and manage hotel properties
4. **Manage Staff**: Click "Staff" to add and manage staff accounts
5. **Add Rooms**: From hotel details, switch to "Rooms" tab and click "Add Room"

## API Endpoints Expected

The frontend expects the following backend API endpoints:

### Authentication

- `POST /api/auth/login` - User login

### Admin Dashboard

- `GET /api/admin/dashboard/stats` - Dashboard statistics

### Staff Management

- `GET /api/admin/staff` - Get all staff
- `POST /api/admin/staff` - Create staff
- `PUT /api/admin/staff/:id` - Update staff
- `DELETE /api/admin/staff/:id` - Delete staff

### Hotel Management (existing)

- `GET /api/admin/hotels` - Get all hotels
- `POST /api/admin/hotels` - Create hotel
- `PUT /api/admin/hotels/:id` - Update hotel
- `DELETE /api/admin/hotels/:id` - Delete hotel

### Room Management

- `POST /api/admin/hotels/:hotelId/rooms` - Create room
- `PUT /api/admin/hotels/:hotelId/rooms/:id` - Update room
- `DELETE /api/admin/hotels/:hotelId/rooms/:id` - Delete room

## Security Features

1. **Authentication Required**: All admin routes require valid authentication
2. **Role-based Access**: Different user roles have different access levels
3. **Session Management**: User sessions are managed via localStorage
4. **Auto-logout**: Users are redirected to login when not authenticated

## Future Enhancements

1. **Manager Portal**: Dedicated dashboard for hotel managers
2. **Receptionist Portal**: Interface for front desk staff
3. **Password Change**: Allow staff to change their passwords
4. **Advanced Filtering**: More sophisticated search and filter options
5. **Bulk Operations**: Mass operations for hotels and staff
6. **Audit Logs**: Track changes and user activities



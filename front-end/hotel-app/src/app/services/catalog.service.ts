import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Hotel } from "../models/hotel";
import { RoomType } from "../models/room-type";
import { Room } from "../models/room";
import { Staff, LoginRequest, LoginResponse } from "../models/staff";

@Injectable({providedIn: 'root'})
export class CatalogService {
    private http = inject(HttpClient);
    private base = environment.apiBaseUrl;

    hotels(): Observable<Hotel[]>{
        return this.http.get<Hotel[]>(`${this.base}/api/admin/hotels`);
    }

    hotelById(id: number): Observable<Hotel>{
        return this.http.get<Hotel>(`${this.base}/api/admin/hotels/${id}`);
    }

    roomTypes(hotelId: number): Observable<RoomType[]> {
        return this.http.get<RoomType[]>(`${this.base}/api/admin/hotels/${hotelId}/roomtypes`);
    }

    rooms(hotelId: number, params?: {status?:string; roomTypeId?: string;}): Observable<Room[]> {
        const q = new URLSearchParams();
        if(params?.status) q.set('status', params.status);
        if(params?.roomTypeId) q.set('roomTypeId', String(params.roomTypeId));
        const qs = q.toString() ? `?${q}` : '';
        return this.http.get<Room[]>(`${this.base}/api/admin/hotels/${hotelId}/rooms${qs}`);

    }

    createHotel(hotel: Partial<Hotel>){
        return this.http.post<Hotel>(`${this.base}/api/admin/hotels`, hotel);
    }

    updateHotel(id: number, hotel: any){
        return this.http.put<Hotel>(`${this.base}/api/admin/hotels/${id}`, hotel);
    }

    deleteHotel(id: number) {
        return this.http.delete(`${this.base}/api/admin/hotels/${id}`);
    }
    
    // Room Types
    getRoomTypes(hotelId: number) { return this.http.get<RoomType[]>(`${this.base}/api/admin/hotels/${hotelId}/roomtypes`); }
    createRoomType(hotelId: number, rt: Partial<RoomType>) { return this.http.post<RoomType>(`${this.base}/api/admin/hotels/${hotelId}/roomtypes`, rt); }
    updateRoomType(hotelId:number, id: number, rt: RoomType) { return this.http.post<RoomType>(`${this.base}/api/admin/hotels/${hotelId}/roomtypes/${id}`, rt); }
    deleteRoomType(hotelId:number, id: number) { return this.http.delete(`${this.base}/api/admin/hotels/${hotelId}/roomtypes/${id}`); }
 
    // Rooms
    createRoom(hotelId: number, room: any) { 
        const { roomTypeId, ...roomData } = room;
        return this.http.post(`${this.base}/api/admin/hotels/${hotelId}/rooms?roomTypeId=${roomTypeId}`, roomData); 
    }
    getRoom(hotelId: number, id: number): Observable<Room> {
        return this.http.get<Room>(`${this.base}/api/admin/hotels/${hotelId}/rooms/${id}`);
    }
    updateRoom(hotelId: number, id: number, room: any) { return this.http.put(`${this.base}/api/admin/hotels/${hotelId}/rooms/${id}`, room); }
    deleteRoom(hotelId: number, id: number) { return this.http.delete(`${this.base}/api/admin/hotels/${hotelId}/rooms/${id}`); }

    // Authentication
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.base}/api/auth/login`, credentials);
    }

    // Staff Management (Unified)
    getStaff(): Observable<Staff[]> {
        return this.http.get<Staff[]>(`${this.base}/api/admin/staff`);
    }

    createStaff(staff: Partial<Staff>): Observable<Staff> {
        return this.http.post<Staff>(`${this.base}/api/admin/staff`, staff);
    }

    updateStaff(id: number, staff: Partial<Staff>): Observable<Staff> {
        return this.http.put<Staff>(`${this.base}/api/admin/staff/${id}`, staff);
    }

    deleteStaff(id: number): Observable<any> {
        return this.http.delete(`${this.base}/api/admin/staff/${id}`);
    }

    // Get available hotels for staff assignment
    getAvailableHotels(): Observable<Hotel[]> {
        return this.http.get<Hotel[]>(`${this.base}/api/admin/hotels`);
    }

    // Dashboard Stats
    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.base}/api/admin/dashboard/stats`);
    }

    // Manager Dashboard Stats
    getManagerDashboardStats(hotelId: number): Observable<any> {
        return this.http.get(`${this.base}/api/manager/dashboard/stats?hotelId=${hotelId}`);
    }

    // Receptionist APIs
    getTodaysCheckins(hotelId: number) {
        return this.http.get<any[]>(`${this.base}/api/receptionist/hotels/${hotelId}/checkins/today`);
    }

    searchBookings(hotelId: number, from: string, to: string, status?: string) {
        const q = new URLSearchParams({ from, to });
        if (status) q.set('status', status);
        return this.http.get<any[]>(`${this.base}/api/receptionist/hotels/${hotelId}/bookings?${q.toString()}`);
    }

    createBooking(hotelId: number, roomTypeId: number, payload: { guestName: string; checkInTime: string; checkOutTime: string; }) {
        return this.http.post(`${this.base}/api/receptionist/hotels/${hotelId}/bookings?roomTypeId=${roomTypeId}`, payload);
    }

    checkIn(hotelId: number, bookingId: number) {
        return this.http.post(`${this.base}/api/receptionist/hotels/${hotelId}/bookings/${bookingId}/checkin`, {});
    }

    checkOut(hotelId: number, bookingId: number) {
        return this.http.post(`${this.base}/api/receptionist/hotels/${hotelId}/bookings/${bookingId}/checkout`, {});
    }
    cancle(hotelId: number, bookingId: number) {
    return this.http.post(`${this.base}/api/receptionist/hotels/${hotelId}/bookings/${bookingId}/cancle`, {});
    }

    updateRoomStatusByReceptionist(hotelId: number, roomId: number, status: 'AVAILABLE'|'MAINTENANCE'|'BOOKED') {
        return this.http.put(`${this.base}/api/receptionist/hotels/${hotelId}/rooms/${roomId}/status?status=${status}`, {});
    }

    // Auth - password update
    updatePassword(username: string, newPassword: string) {
        return this.http.post(`${this.base}/api/auth/reset`, { username, newPassword });
    }

    // Receptionist: available rooms by type
    getAvailableRooms(hotelId: number, roomTypeId: number) {
        return this.http.get<any[]>(`${this.base}/api/receptionist/hotels/${hotelId}/rooms/available?roomTypeId=${roomTypeId}`);
    }
}
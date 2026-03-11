package com.ilpmum.hotel.catalog_service.controller;

import com.ilpmum.hotel.catalog_service.model.Staff;
import com.ilpmum.hotel.catalog_service.repo.RoomRepository;
import com.ilpmum.hotel.catalog_service.repo.BookingRepository;
import com.ilpmum.hotel.catalog_service.model.Booking;
import com.ilpmum.hotel.catalog_service.repo.StaffRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/manager/dashboard")
public class ManagerDashboardController {

    private final RoomRepository rooms;
    private final StaffRepository staff;
    private final BookingRepository bookings;

    public ManagerDashboardController(RoomRepository rooms, StaffRepository staff, BookingRepository bookings) {
        this.rooms = rooms;
        this.staff = staff;
        this.bookings = bookings;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestParam Long hotelId) {
        Map<String, Object> stats = new HashMap<>();

        // Counts
        stats.put("totalRooms", rooms.countByHotelId(hotelId));
        long totalBookings = bookings.findByHotel_Id(hotelId).size();
        long activeCheckIns = bookings.findByHotel_IdAndStatus(hotelId, Booking.Status.CHECKED_IN).size();
        long pendingCheckIns = bookings.findByHotel_IdAndStatus(hotelId, Booking.Status.BOOKED).size();
        stats.put("totalBookings", totalBookings);
        stats.put("activeCheckIns", activeCheckIns);
        stats.put("pendingCheckIns", pendingCheckIns);

        // Count active receptionists only for manager view
        long activeReceptionists = staff.countByHotelIdAndRoleAndStatus(hotelId, Staff.Role.RECEPTIONIST, Staff.Status.ACTIVE);
        stats.put("activeStaff", activeReceptionists);

        return stats;
    }
}

package com.ilpmum.hotel.catalog_service.controller;

import org.springframework.web.bind.annotation.*;
import com.ilpmum.hotel.catalog_service.repo.HotelRepository;
import com.ilpmum.hotel.catalog_service.repo.RoomRepository;
import com.ilpmum.hotel.catalog_service.model.Staff;
import com.ilpmum.hotel.catalog_service.repo.StaffRepository;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final HotelRepository hotels;
    private final RoomRepository rooms;
    private final StaffRepository staff;

    public DashboardController(HotelRepository hotels, RoomRepository rooms, StaffRepository staff) {
        this.hotels = hotels;
        this.rooms = rooms;
        this.staff = staff;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Count total hotels
        stats.put("totalHotels", hotels.count());

        // Count total rooms across all hotels
        stats.put("totalRooms", rooms.count());

        // Count total staff via unified staff repository
        long unifiedCount = staff.countByStatus(Staff.Status.ACTIVE);
        stats.put("activeStaff", unifiedCount);

        // Placeholder for other stats
        stats.put("totalBookings", 0);
        stats.put("activeCheckIns", 0);
        stats.put("pendingCheckIns", 0);

        return stats;
    }
}

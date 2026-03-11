package com.ilpmum.hotel.catalog_service.controller;

import com.ilpmum.hotel.catalog_service.model.Booking;
import com.ilpmum.hotel.catalog_service.model.Room;
import com.ilpmum.hotel.catalog_service.repo.BookingRepository;
import com.ilpmum.hotel.catalog_service.repo.HotelRepository;
import com.ilpmum.hotel.catalog_service.repo.RoomRepository;
import com.ilpmum.hotel.catalog_service.repo.RoomTypeRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/receptionist/hotels/{hotelId}")
public class BookingController {

    private final BookingRepository bookings;
    private final HotelRepository hotels;
    private final RoomRepository rooms;
    private final RoomTypeRepository roomTypes;

    public BookingController(BookingRepository bookings, HotelRepository hotels, RoomRepository rooms, RoomTypeRepository roomTypes) {
        this.bookings = bookings;
        this.hotels = hotels;
        this.rooms = rooms;
        this.roomTypes = roomTypes;
    }

    @GetMapping("/checkins/today")
    public List<Booking> todaysCheckins(@PathVariable Long hotelId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        return bookings.findCheckInsBetween(hotelId, start, end);
    }

    @GetMapping("/bookings")
    public List<Booking> searchBookings(
            @PathVariable Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) Booking.Status status) {
        return bookings.search(hotelId, from, to, status);
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@PathVariable Long hotelId, @RequestParam Long roomTypeId,
                                           @RequestBody Map<String, Object> body) {
        var hotel = hotels.findById(hotelId).orElseThrow();
        var roomType = roomTypes.findById(roomTypeId).orElseThrow();
        String guestName = Objects.toString(body.get("guestName"), null);
        // accept date-only (YYYY-MM-DD) without time; default to midnight
        String ci = Objects.toString(body.get("checkInDate"), Objects.toString(body.get("checkInTime")));
        String co = Objects.toString(body.get("checkOutDate"), Objects.toString(body.get("checkOutTime")));
        LocalDateTime checkInTime = ci.length() == 10 ? LocalDate.parse(ci).atStartOfDay() : LocalDateTime.parse(ci);
        LocalDateTime checkOutTime = co.length() == 10 ? LocalDate.parse(co).atStartOfDay() : LocalDateTime.parse(co);
        if (guestName == null || checkInTime == null || checkOutTime == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("guestName, checkInTime, checkOutTime are required");
        }

        // Find an AVAILABLE room of this type
        var candidates = rooms.findByHotelIdAndRoomTypeId(hotelId, roomTypeId);
        Optional<Room> available = candidates.stream().filter(r -> r.getStatus() == Room.Status.AVAILABLE).findFirst();
        if (available.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("No AVAILABLE rooms for selected type");
        }

        var booking = new Booking();
        booking.setHotel(hotel);
        booking.setRoomType(roomType);
        booking.setRoom(available.get());
        booking.setGuestName(guestName);
        booking.setBookingCode("BKG-" + System.currentTimeMillis());
        booking.setCheckInTime(checkInTime);
        booking.setCheckOutTime(checkOutTime);
        booking.setStatus(Booking.Status.BOOKED);

        // Mark room as BOOKED
        var room = available.get();
        room.setStatus(Room.Status.BOOKED);
        rooms.save(room);

        return ResponseEntity.status(HttpStatus.CREATED).body(bookings.save(booking));
    }

    @GetMapping("/rooms/available")
    public List<Room> availableRooms(@PathVariable Long hotelId, @RequestParam Long roomTypeId) {
        var candidates = rooms.findByHotelIdAndRoomTypeId(hotelId, roomTypeId);
        List<Room> result = new ArrayList<>();
        for (var r : candidates) if (r.getStatus() == Room.Status.AVAILABLE) result.add(r);
        return result;
    }

    @PostMapping("/bookings/{bookingId}/checkin")
    public ResponseEntity<?> checkIn(@PathVariable Long hotelId, @PathVariable Long bookingId) {
        var booking = bookings.findById(bookingId).orElseThrow();
        if (!Objects.equals(booking.getHotel().getId(), hotelId)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if (booking.getStatus() != Booking.Status.BOOKED) return ResponseEntity.status(HttpStatus.CONFLICT).body("Booking is not in BOOKED status");

        // Validate current time matches scheduled check-in day (same day)
        LocalDate today = LocalDate.now();
        if (!today.equals(booking.getCheckInTime().toLocalDate())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Check-in is allowed only on scheduled day");
        }

        booking.setStatus(Booking.Status.CHECKED_IN);
        // Mark room as BOOKED (already), keep as BOOKED to indicate occupied
        return ResponseEntity.ok(bookings.save(booking));
    }

    @PostMapping("/bookings/{bookingId}/checkout")
    public ResponseEntity<?> checkOut(@PathVariable Long hotelId, @PathVariable Long bookingId) {
        var booking = bookings.findById(bookingId).orElseThrow();
        if (!Objects.equals(booking.getHotel().getId(), hotelId)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if (booking.getStatus() != Booking.Status.CHECKED_IN) return ResponseEntity.status(HttpStatus.CONFLICT).body("Booking is not in CHECKED_IN status");

        // Validate current day matches scheduled checkout day
        LocalDate today = LocalDate.now();
        if (!today.equals(booking.getCheckOutTime().toLocalDate())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Check-out allowed only on scheduled day");
        }

        booking.setStatus(Booking.Status.CHECKED_OUT);
        // Release room to AVAILABLE
        var room = booking.getRoom();
        room.setStatus(Room.Status.AVAILABLE);
        rooms.save(room);
        return ResponseEntity.ok(bookings.save(booking));
    }

    @PutMapping("/rooms/{roomId}/status")
    public ResponseEntity<?> updateRoomStatus(
            @PathVariable Long hotelId,
            @PathVariable Long roomId,
            @RequestParam Room.Status status) {
        var room = rooms.findByIdAndHotel_Id(roomId, hotelId).orElseThrow(() -> new RuntimeException("Room not found"));
        // Do not allow changing status if a current booking has CHECKED_IN for this room
        boolean occupied = bookings.findByHotel_Id(hotelId).stream()
                .anyMatch(b -> Objects.equals(b.getRoom().getId(), roomId) && b.getStatus() == Booking.Status.CHECKED_IN);
        if (occupied) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot update status while a guest is checked in");
        }
        room.setStatus(status);
        rooms.save(room);
        return ResponseEntity.ok(room);
    }
    @PostMapping("/bookings/{bookingId}/cancle")
    public ResponseEntity<?> cancle(@PathVariable Long hotelId, @PathVariable Long bookingId) {
        var booking = bookings.findById(bookingId).orElseThrow();
        if (!Objects.equals(booking.getHotel().getId(), hotelId)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        //if (booking.getStatus() != Booking.Status.CHECKED_IN) return ResponseEntity.status(HttpStatus.CONFLICT).body("Booking is not in CHECKED_IN status");

        // Validate current day matches scheduled checkout day
        LocalDate today = LocalDate.now();
        if (!today.equals(booking.getCheckInTime().toLocalDate()) || today.isBefore(booking.getCheckInTime().toLocalDate())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cancellation not allowed");
        }

        booking.setStatus(Booking.Status.CHECKED_OUT);
        // Release room to AVAILABLE
        var room = booking.getRoom();
        room.setStatus(Room.Status.AVAILABLE);
        rooms.save(room);
        return ResponseEntity.ok(bookings.save(booking));
    }
}



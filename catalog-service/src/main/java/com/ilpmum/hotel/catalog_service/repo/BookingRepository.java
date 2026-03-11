package com.ilpmum.hotel.catalog_service.repo;

import com.ilpmum.hotel.catalog_service.model.Booking;
import com.ilpmum.hotel.catalog_service.model.Booking.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByHotel_Id(Long hotelId);

    List<Booking> findByHotel_IdAndStatus(Long hotelId, Status status);

    @Query("select b from Booking b where b.hotel.id = :hotelId and b.checkInTime >= :start and b.checkInTime < :end")
    List<Booking> findCheckInsBetween(@Param("hotelId") Long hotelId,
                                      @Param("start") LocalDateTime start,
                                      @Param("end") LocalDateTime end);

    @Query("select b from Booking b where b.hotel.id = :hotelId and (:status is null or b.status = :status) and b.checkInTime >= :from and b.checkOutTime <= :to")
    List<Booking> search(@Param("hotelId") Long hotelId,
                         @Param("from") LocalDateTime from,
                         @Param("to") LocalDateTime to,
                         @Param("status") Status status);
}



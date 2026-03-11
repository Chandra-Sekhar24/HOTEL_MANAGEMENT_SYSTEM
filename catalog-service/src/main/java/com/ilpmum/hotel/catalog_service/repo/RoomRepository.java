package com.ilpmum.hotel.catalog_service.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ilpmum.hotel.catalog_service.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

	List<Room> findByHotelId(Long hotelId);

	List<Room> findByHotelIdAndStatus(Long hotelId, Room.Status status);

	List<Room> findByHotelIdAndRoomTypeId(Long hotelId, Long roomTypeId);

	Optional<Room> findByIdAndHotel_Id(Long id, Long hotelId);

	long countByRoomTypeId(Long roomTypeId);

	long count(); // Count all rooms across all hotels

	long countByHotelId(Long hotelId);

	boolean existsByHotel_IdAndRoomNumber(Long hotelId, String roomNumber);

}

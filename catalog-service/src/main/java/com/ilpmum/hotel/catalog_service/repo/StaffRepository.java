package com.ilpmum.hotel.catalog_service.repo;

import com.ilpmum.hotel.catalog_service.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    long countByStatus(Staff.Status status);

    List<Staff> findByRole(Staff.Role role);

    long countByHotelIdAndRole(Long hotelId, Staff.Role role);

    Optional<Staff> findByUsername(String username);

    Optional<Staff> findByUsernameIgnoreCase(String username);

    Optional<Staff> findByEmailIgnoreCase(String email);

    long countByHotelIdAndRoleAndStatus(Long hotelId, Staff.Role role, Staff.Status status);

    long countByHotelIdAndStatus(Long hotelId, Staff.Status status);
}

package com.ilpmum.hotel.catalog_service.controller;

import com.ilpmum.hotel.catalog_service.model.Hotel;
import com.ilpmum.hotel.catalog_service.repo.HotelRepository;
import com.ilpmum.hotel.catalog_service.repo.StaffRepository;
import com.ilpmum.hotel.catalog_service.util.CredentialGenerator;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/managers")
@CrossOrigin(origins = "http://localhost:4200")
public class ManagerCompatController {

    private final StaffRepository staffRepository;
    private final HotelRepository hotelRepository;

    public ManagerCompatController(StaffRepository staffRepository, HotelRepository hotelRepository) {
        this.staffRepository = staffRepository;
        this.hotelRepository = hotelRepository;
    }

    @GetMapping
    public java.util.List<com.ilpmum.hotel.catalog_service.model.Staff> list() {
        return staffRepository.findByRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.MANAGER);
    }

    @GetMapping("/{id}")
    public com.ilpmum.hotel.catalog_service.model.Staff get(@PathVariable Long id) {
        return staffRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public com.ilpmum.hotel.catalog_service.model.Staff create(
            @RequestBody com.ilpmum.hotel.catalog_service.model.Staff body) {
        body.setRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.MANAGER);
        if (body.getHotel() != null) {
            Hotel hotel = hotelRepository.findById(body.getHotel().getId()).orElseThrow();
            body.setHotel(hotel);
        }
        // Enforce single manager per hotel
        if (body.getHotel() != null) {
            long existingManagers = staffRepository.countByHotelIdAndRole(body.getHotel().getId(),
                    com.ilpmum.hotel.catalog_service.model.Staff.Role.MANAGER);
            if (existingManagers > 0) {
                throw new IllegalStateException("This hotel already has a manager");
            }
        }
        if (body.getEmail() == null || body.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        body.setUsername(body.getEmail().toLowerCase().trim());
        body.setPassword(CredentialGenerator.generatePassword());
        return staffRepository.save(body);
    }

    @PutMapping("/{id}")
    public com.ilpmum.hotel.catalog_service.model.Staff update(@PathVariable Long id,
            @RequestBody com.ilpmum.hotel.catalog_service.model.Staff body) {
        var existing = staffRepository.findById(id).orElseThrow();
        existing.setName(body.getName());
        existing.setEmail(body.getEmail());
        existing.setPhone(body.getPhone());
        if (body.getHotel() != null) {
            Hotel hotel = hotelRepository.findById(body.getHotel().getId()).orElseThrow();
            existing.setHotel(hotel);
        }
        if (body.getStatus() != null) {
            existing.setStatus(body.getStatus());
        }
        existing.setRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.MANAGER);
        // Enforce single manager per hotel on update
        if (existing.getHotel() != null) {
            long existingManagers = staffRepository.countByHotelIdAndRole(existing.getHotel().getId(),
                    com.ilpmum.hotel.catalog_service.model.Staff.Role.MANAGER);
            if (existingManagers > 0) {
                var managers = staffRepository.findByRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.MANAGER);
                for (var s : managers) {
                    if (s.getHotel() != null && existing.getHotel() != null &&
                            Long.valueOf(s.getHotel().getId()).equals(existing.getHotel().getId()) &&
                            !Long.valueOf(s.getId()).equals(existing.getId())) {
                        throw new IllegalStateException("This hotel already has a manager");
                    }
                }
            }
        }
        return staffRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        staffRepository.deleteById(id);
    }
}

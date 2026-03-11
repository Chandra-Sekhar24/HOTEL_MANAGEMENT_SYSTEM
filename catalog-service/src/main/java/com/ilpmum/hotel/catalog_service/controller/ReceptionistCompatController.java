package com.ilpmum.hotel.catalog_service.controller;

import com.ilpmum.hotel.catalog_service.model.Hotel;
import com.ilpmum.hotel.catalog_service.repo.HotelRepository;
import com.ilpmum.hotel.catalog_service.repo.StaffRepository;
import com.ilpmum.hotel.catalog_service.util.CredentialGenerator;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/receptionists")
@CrossOrigin(origins = "http://localhost:4200")
public class ReceptionistCompatController {

    private final StaffRepository staffRepository;
    private final HotelRepository hotelRepository;

    public ReceptionistCompatController(StaffRepository staffRepository, HotelRepository hotelRepository) {
        this.staffRepository = staffRepository;
        this.hotelRepository = hotelRepository;
    }

    @GetMapping
    public java.util.List<com.ilpmum.hotel.catalog_service.model.Staff> list() {
        return staffRepository.findByRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.RECEPTIONIST);
    }

    @GetMapping("/{id}")
    public com.ilpmum.hotel.catalog_service.model.Staff get(@PathVariable Long id) {
        return staffRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public com.ilpmum.hotel.catalog_service.model.Staff create(
            @RequestBody com.ilpmum.hotel.catalog_service.model.Staff body) {
        body.setRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.RECEPTIONIST);
        if (body.getHotel() != null) {
            Hotel hotel = hotelRepository.findById(body.getHotel().getId()).orElseThrow();
            body.setHotel(hotel);
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
        existing.setRole(com.ilpmum.hotel.catalog_service.model.Staff.Role.RECEPTIONIST);
        return staffRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        staffRepository.deleteById(id);
    }
}

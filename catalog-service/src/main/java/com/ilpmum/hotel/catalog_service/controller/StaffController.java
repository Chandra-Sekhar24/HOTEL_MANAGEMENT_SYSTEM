package com.ilpmum.hotel.catalog_service.controller;

import com.ilpmum.hotel.catalog_service.model.Hotel;
import com.ilpmum.hotel.catalog_service.model.Staff;
import com.ilpmum.hotel.catalog_service.repo.HotelRepository;
import com.ilpmum.hotel.catalog_service.repo.StaffRepository;
import com.ilpmum.hotel.catalog_service.util.CredentialGenerator;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/admin/staff")
@CrossOrigin(origins = "http://localhost:4200")
public class StaffController {

    private final StaffRepository staffRepository;
    private final HotelRepository hotelRepository;

    public StaffController(StaffRepository staffRepository, HotelRepository hotelRepository) {
        this.staffRepository = staffRepository;
        this.hotelRepository = hotelRepository;
    }

    @GetMapping
    public List<Staff> list() {
        return staffRepository.findAll();
    }

    @GetMapping("/{id}")
    public Staff get(@PathVariable Long id) {
        return staffRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Staff create(@RequestBody Staff body) {
        if (body.getHotel() != null) {
            Hotel hotel = hotelRepository.findById(body.getHotel().getId()).orElseThrow();
            body.setHotel(hotel);
        }

        // Enforce single manager per hotel
        if (body.getRole() == Staff.Role.MANAGER && body.getHotel() != null) {
            long existingManagers = staffRepository.countByHotelIdAndRole(body.getHotel().getId(), Staff.Role.MANAGER);
            if (existingManagers > 0) {
                throw new IllegalStateException("This hotel already has a manager");
            }
        }

        // Validate email and phone
        if (body.getEmail() == null || !isValidEmail(body.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (body.getPhone() != null && !body.getPhone().isBlank() && !isValidPhone(body.getPhone())) {
            throw new IllegalArgumentException("Invalid phone number. Must be 10 digits and not start with 0");
        }

        // Username should be email; generate only password
        body.setUsername(body.getEmail().toLowerCase(Locale.ROOT).trim());
        body.setPassword(CredentialGenerator.generatePassword());

        return staffRepository.save(body);
    }

    @PutMapping("/{id}")
    public Staff update(@PathVariable Long id, @RequestBody Staff body) {
        var existing = staffRepository.findById(id).orElseThrow();
        existing.setName(body.getName());
        if (body.getEmail() != null) {
            if (!isValidEmail(body.getEmail())) throw new IllegalArgumentException("Invalid email format");
            existing.setEmail(body.getEmail());
            // Keep username in sync with email
            existing.setUsername(body.getEmail().toLowerCase(Locale.ROOT).trim());
        }
        if (body.getPhone() != null) {
            if (!body.getPhone().isBlank() && !isValidPhone(body.getPhone())) throw new IllegalArgumentException("Invalid phone number. Must be 10 digits and not start with 0");
            existing.setPhone(body.getPhone());
        }
        if (body.getHotel() != null) {
            Hotel hotel = hotelRepository.findById(body.getHotel().getId()).orElseThrow();
            existing.setHotel(hotel);
        }
        if (body.getStatus() != null) {
            existing.setStatus(body.getStatus());
        }
        if (body.getRole() != null) {
            existing.setRole(body.getRole());
        }

        // Enforce single manager per hotel on update
        if (existing.getRole() == Staff.Role.MANAGER && existing.getHotel() != null) {
            long existingManagers = staffRepository.countByHotelIdAndRole(existing.getHotel().getId(),
                    Staff.Role.MANAGER);
            if (existingManagers > 0) {
                var managers = staffRepository.findByRole(Staff.Role.MANAGER);
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

    private static final Pattern EMAIL_RX = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern PHONE_RX = Pattern.compile("^[1-9][0-9]{9}$");

    private boolean isValidEmail(String email){
        if (email == null) return false;
        email = email.trim();
        return EMAIL_RX.matcher(email).matches();
    }

    private boolean isValidPhone(String phone){
        if (phone == null) return false;
        phone = phone.trim();
        return PHONE_RX.matcher(phone).matches();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        staffRepository.deleteById(id);
    }
}

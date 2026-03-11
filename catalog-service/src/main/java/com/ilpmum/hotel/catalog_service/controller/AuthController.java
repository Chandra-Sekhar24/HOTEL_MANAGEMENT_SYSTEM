package com.ilpmum.hotel.catalog_service.controller;

import com.ilpmum.hotel.catalog_service.model.Staff;
import com.ilpmum.hotel.catalog_service.repo.StaffRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StaffRepository staffRepository;

    public AuthController(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username != null)
            username = username.trim();
        if (password != null)
            password = password.trim();
        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required");
        }
        final String uname = username;
        var userOpt = staffRepository.findByUsername(uname)
                .or(() -> staffRepository.findByUsernameIgnoreCase(uname))
                .or(() -> staffRepository.findByEmailIgnoreCase(uname));
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        var user = userOpt.get();
        if (user.getPassword() == null || !user.getPassword().trim().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        if (user.getStatus() != Staff.Status.ACTIVE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is inactive");
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", "mock-token-" + System.currentTimeMillis());
        resp.put("user", user);
        resp.put("role", user.getRole().name());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String newPassword = body.get("newPassword");
        if (username == null || newPassword == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("username and newPassword are required");
        }
        username = username.trim();
        newPassword = newPassword.trim();

        final String uname2 = username;
        var userOpt = staffRepository.findByUsername(uname2)
                .or(() -> staffRepository.findByUsernameIgnoreCase(uname2))
                .or(() -> staffRepository.findByEmailIgnoreCase(uname2));
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        var user = userOpt.get();
        user.setPassword(newPassword);
        staffRepository.save(user);
        return ResponseEntity.ok("Password updated");
    }
}

package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.auth.LoginRequest;
import com.elwaseet.backend.dto.auth.LoginResponse;
import com.elwaseet.backend.dto.auth.RegisterDTO;
import com.elwaseet.backend.dto.auth.ResendOtpRequest;
import com.elwaseet.backend.dto.auth.VerifyDTO;
import com.elwaseet.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// Admin Endpoint Related - Uncomment imports for initial setup
// import com.elwaseet.backend.entity.AdminUser;
// import com.elwaseet.backend.repository.AdminUserRepository;
// import org.springframework.security.crypto.password.PasswordEncoder;
import com.elwaseet.backend.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    // Admin Endpoint Related - Uncomment for initial setup
    // private final AdminUserRepository adminUserRepository;
    // private final PasswordEncoder passwordEncoder;
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDTO registerDTO) {
        authService.register(registerDTO);
        return ResponseEntity.ok("User registered successfully");
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyDTO request) {
        authService.verifyAccount(request);
        return ResponseEntity.ok("Email verified successfully");
    }
    
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendOtp(request);
        return ResponseEntity.ok("New OTP Sent");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal User user) {
        // Spring automatically injects the authenticated user
        return ResponseEntity.ok(user);
    }

    // Admin Endpoint Related - Uncomment admin registration endpoint for initial setup
    // @PostMapping("/register-admin")
    // public ResponseEntity<?> registerAdmin(@RequestBody RegisterDTO dto) {
    //     // Hash password
    //     String hashedPassword = passwordEncoder.encode(dto.getPassword());
        
    //     // Create admin user
    //     AdminUser admin = new AdminUser();
    //     admin.setEmail(dto.getEmail());
    //     admin.setPasswordHash(hashedPassword);
    //     admin.setName(dto.getName());
        
    //     adminUserRepository.save(admin);
        
    //     return ResponseEntity.ok("Admin created successfully");
    // }

    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> adminLogin(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }
}
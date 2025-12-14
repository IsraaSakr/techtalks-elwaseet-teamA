package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.RegisterDto;
import com.elwaseet.backend.dto.ResendOtpRequest;
import com.elwaseet.backend.dto.VerifyDto;
import com.elwaseet.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.elwaseet.backend.dto.LoginRequest;
import com.elwaseet.backend.dto.LoginResponse;
import com.elwaseet.backend.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto registerDto) {
        authService.register(registerDto);
        return ResponseEntity.ok("User registered successfully");
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyDto request) {
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
}
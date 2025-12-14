package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.RegisterDto;
import com.elwaseet.backend.dto.ResendOtpRequest;
import com.elwaseet.backend.dto.VerifyDto;
import com.elwaseet.backend.entity.OtpCode;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.ConflictException;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.elwaseet.backend.dto.LoginRequest;
import com.elwaseet.backend.dto.LoginResponse;
import com.elwaseet.backend.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepo;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterDto registerDto) {

        System.out.println("AUTH SERVICE REGISTER HIT ✅");

        // 1. Check if email exists and handle unverified accounts
        String email = registerDto.getEmail().trim().toLowerCase();

        // Check if email exists
        Optional<User> existingUser = authRepo.findByEmail(email);

        if (existingUser.isPresent()) {
            User existingUserEntity = existingUser.get();
            if (existingUserEntity.getIsEmailVerified()) {
                throw new ConflictException("Email is already in use");
            } else {
                // Delete old unverified account and create new one
                authRepo.delete(existingUserEntity);
            }
        }

        // 2. Create User entity (AccountType is already enum from DTO)
        User user = new User(
                email,
                passwordEncoder.encode(registerDto.getPassword()),
                registerDto.getName(),
                registerDto.getPhone(),
                registerDto.getLocation(),
                registerDto.getAccountType());

        // 3. Ensure email is not verified yet
        user.setIsEmailVerified(false);

        // 4. Save to repository
        User savedUser = authRepo.save(user);

        System.out.println("ABOUT TO CALL OTP SERVICE ✅");

        // 5. Generate and Send OTP
        otpService.generateAndSaveOtp(savedUser);
    }

    public void verifyAccount(VerifyDto verifyDto) {
        
        // Normalize email
        String email = verifyDto.getEmail().trim().toLowerCase();
        
        User user = authRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate OTP against this user
        OtpCode otpCode = otpService.validateOtp(verifyDto.getCode(), user);

        // Mark OTP as used
        otpService.markAsUsed(otpCode);

        // Mark user as verified
        user.setIsEmailVerified(true);
        authRepo.save(user);
    }

    public void resendOtp(ResendOtpRequest request) {
        
        // Normalize email
        String email = request.getEmail().trim().toLowerCase();
        
        User user = authRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Invalidate old OTPs and generate new one
        otpService.invalidateOtps(user);
        otpService.generateAndSaveOtp(user);
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        
        User user = authRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        
        if (!user.getIsEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Email not verified");
        }
        
        // Record login time
        user.recordLogin();
        authRepo.save(user);
        
        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token, user);
    }
}
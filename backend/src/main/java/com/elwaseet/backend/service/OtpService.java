package com.elwaseet.backend.service;

import com.elwaseet.backend.entity.OtpCode;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.ValidationException;
import com.elwaseet.backend.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpCodeRepository otpRepository;
    private final EmailService emailService;
    
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public void generateAndSaveOtp(User user) {
        System.out.println("OTP SERVICE HIT ✅");

        // Generate random 6-digit code using secure random (000000 - 999999)
        String code = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));

        // Create OTP entity (expires in 15 minutes)
        OtpCode otp = new OtpCode(user, code, LocalDateTime.now().plusMinutes(15));

        // Save to DB
        otpRepository.save(otp);

        // Send via email (production)
        emailService.sendOtpEmail(user.getEmail(), code);

        // Also print to console for development/debugging
        System.out.println("\n\n========================================");
        System.out.println("   🔐 OTP GENERATED FOR: " + user.getEmail());
        System.out.println("   👉 CODE: " + code);
        System.out.println("========================================\n\n");
    }

    public OtpCode validateOtp(String code, User user) {
        // Use safer repository method that checks both code + user in single query
        OtpCode otpCode = otpRepository.findByCodeAndUser(code, user)
                .orElseThrow(() -> new ValidationException("Invalid OTP"));

        if (otpCode.isExpired()) {
            throw new ValidationException("OTP has expired");
        }

        if (Boolean.TRUE.equals(otpCode.getIsUsed())) {
            throw new ValidationException("OTP has already been used");
        }

        return otpCode;
    }

    public void markAsUsed(OtpCode otpCode) {
        otpCode.setIsUsed(true);
        otpRepository.save(otpCode);
    }

    public void invalidateOtps(User user) {
        var otps = otpRepository.findByUser(user);
        for (OtpCode otp : otps) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
        }
    }
}
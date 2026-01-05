package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.user.ChangePasswordRequest;
import com.elwaseet.backend.dto.user.UpdateUserRequest;
import com.elwaseet.backend.dto.user.UserResponseDTO;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.BadRequestException;
import com.elwaseet.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Update user profile fields
     */
    @Transactional
    public UserResponseDTO updateProfile(Long userId, UpdateUserRequest request) {
        User user = userRepository.findByIdWithProfile(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        // Update only non-null fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        if (request.getPhone() != null) {
            // Check if phone already exists for another user
            userRepository.findByPhone(request.getPhone())
                    .ifPresent(existingUser -> {
                        if (!existingUser.getUserId().equals(userId)) {
                            throw new BadRequestException("Phone number already in use");
                        }
                    });
            user.setPhone(request.getPhone());
        }
        
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        
        User saved = userRepository.save(user);
        return new UserResponseDTO(saved);
    }
    
    /**
     * Change password
     */
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        
        // Ensure new password is different
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }
        
        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
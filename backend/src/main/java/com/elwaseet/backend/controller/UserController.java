package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.user.UpdateUserRequest;
import com.elwaseet.backend.dto.user.UserResponseDTO;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * Update current user's profile
     * PUT /api/users/me
     */
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> updateProfile(
            @Valid @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal User user) {
        
        UserResponseDTO updated = userService.updateProfile(user.getUserId(), request);
        return ResponseEntity.ok(updated);
    }
}
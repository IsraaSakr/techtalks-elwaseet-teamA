package com.elwaseet.backend.dto.user;

import com.elwaseet.backend.entity.Location;
import com.elwaseet.backend.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private Long userId;
    private String email;
    private String name;
    private String phone;
    private Location location;
    private User.AccountType accountType;
    private String profilePhotoUrl;
    private Boolean isEmailVerified;
    private LocalDateTime createdAt;
    
    public UserResponseDTO(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.location = user.getLocation();
        this.accountType = user.getAccountType();
        this.profilePhotoUrl = user.getProfilePhotoUrl();
        this.isEmailVerified = user.getIsEmailVerified();
        this.createdAt = user.getCreatedAt();
    }
}

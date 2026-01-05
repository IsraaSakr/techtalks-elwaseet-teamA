package com.elwaseet.backend.dto.user;

import com.elwaseet.backend.entity.Location;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;
    
    @Pattern(regexp = "^\\+961\\d{8}$", message = "Invalid phone number. Use format: +9611234567")
    private String phone;
    
    private Location location;
}
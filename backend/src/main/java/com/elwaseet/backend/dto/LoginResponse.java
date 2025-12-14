package com.elwaseet.backend.dto;

import com.elwaseet.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
@AllArgsConstructor
@Data
public class LoginResponse {
    private String token;
    private User user;


}

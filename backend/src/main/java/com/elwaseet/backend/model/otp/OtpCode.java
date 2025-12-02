package com.elwaseet.backend.model.otp;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "otp_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String email;
    private String code;
    private Date expiresAt;
    private Date createdAt;
}

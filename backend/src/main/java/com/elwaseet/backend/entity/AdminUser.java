package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "admin_users")
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long adminId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 255)
    private String name;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    /* RELATIONSHIPS */

    @OneToMany(mappedBy = "resolvedBy", fetch = FetchType.LAZY)
    private List<Dispute> disputesResolved = new ArrayList<>();

    @OneToMany(mappedBy = "reviewedBy", fetch = FetchType.LAZY)
    private List<DisputeAppeal> appealsReviewed = new ArrayList<>();

    @OneToMany(mappedBy = "reviewedBy", fetch = FetchType.LAZY)
    private List<ReviewReport> reviewReportsReviewed = new ArrayList<>();

    protected AdminUser() {
    }
}

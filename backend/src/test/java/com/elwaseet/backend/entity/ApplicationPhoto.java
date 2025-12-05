package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_photos")
public class ApplicationPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

    @Column(name = "upload_order")
    private Integer uploadOrder;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    protected ApplicationPhoto() {
    }
}

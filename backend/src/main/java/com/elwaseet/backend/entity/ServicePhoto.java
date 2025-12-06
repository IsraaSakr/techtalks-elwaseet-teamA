package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * SERVICE PHOTO ENTITY
 * ============================================================================
 * Stores photos uploaded by a provider to showcase their services.
 *
 * RELATIONSHIP SUMMARY:
 * - Many photos → belong to one ProviderService (N:1)
 */
@Entity
@Table(
    name = "service_photos",
    indexes = {
        @Index(name = "idx_service_photo_service_id", columnList = "service_id"),
        @Index(name = "idx_service_photo_order", columnList = "service_id, upload_order")
    }
)
public class ServicePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /**
     * Photo belongs to one provider service
     * CRITICAL: service_id NOT profile_id!
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ProviderService providerService;

    @NotBlank(message = "Photo URL is required")
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

    @Size(max = 255, message = "Caption must not exceed 255 characters")
    @Column(name = "caption", length = 255)
    private String caption;

    @Column(name = "upload_order", nullable = false)
    private Integer uploadOrder = 0;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
        if (uploadOrder == null) {
            uploadOrder = 0;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected ServicePhoto() {
        // JPA requires no-arg constructor
    }

    public ServicePhoto(ProviderService providerService, String photoUrl) {
        this.providerService = providerService;
        this.photoUrl = photoUrl;
        this.uploadOrder = 0;
    }

    public ServicePhoto(ProviderService providerService, String photoUrl, Integer uploadOrder) {
        this.providerService = providerService;
        this.photoUrl = photoUrl;
        this.uploadOrder = uploadOrder;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getPhotoId() {
        return photoId;
    }

    public ProviderService getProviderService() {
        return providerService;
    }

    public void setProviderService(ProviderService providerService) {
        this.providerService = providerService;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Integer getUploadOrder() {
        return uploadOrder;
    }

    public void setUploadOrder(Integer uploadOrder) {
        this.uploadOrder = uploadOrder;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    public boolean hasCaption() {
        return caption != null && !caption.trim().isEmpty();
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ServicePhoto)) return false;
        ServicePhoto that = (ServicePhoto) o;
        return photoId != null && photoId.equals(that.getPhotoId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ServicePhoto{" +
                "photoId=" + photoId +
                ", photoUrl='" + photoUrl + '\'' +
                ", uploadOrder=" + uploadOrder +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * ============================================================================
 * PORTFOLIO PHOTO ENTITY
 * ============================================================================
 * Stores photos uploaded by a provider to showcase their profile/portfolio.
 *
 * RELATIONSHIP SUMMARY:
 * - Many photos → belong to one ProviderProfile (N:1)
 * 
 * NOTES:
 * - Maximum 10 portfolio photos per provider (enforced at service layer)
 * - These are different from ServicePhotos (which belong to individual services)
 */
@Entity
@Table(
    name = "portfolio_photos",
    indexes = {
        @Index(name = "idx_portfolio_photo_profile_id", columnList = "profile_id"),
        @Index(name = "idx_portfolio_photo_order", columnList = "profile_id, upload_order")
    }
)
public class PortfolioPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /**
     * Photo belongs to one provider profile
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private ProviderProfile providerProfile;

    @NotBlank(message = "Photo URL is required")
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    @Column(name = "photo_url", length = 500, nullable = false)
    private String photoUrl;

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

    protected PortfolioPhoto() {
        // JPA requires no-arg constructor
    }

    public PortfolioPhoto(ProviderProfile providerProfile, String photoUrl) {
        this.providerProfile = providerProfile;
        this.photoUrl = photoUrl;
        this.uploadOrder = 0;
    }

    public PortfolioPhoto(ProviderProfile providerProfile, String photoUrl, Integer uploadOrder) {
        this.providerProfile = providerProfile;
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

    public ProviderProfile getProviderProfile() {
        return providerProfile;
    }

    public void setProviderProfile(ProviderProfile providerProfile) {
        this.providerProfile = providerProfile;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
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
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PortfolioPhoto)) return false;
        PortfolioPhoto that = (PortfolioPhoto) o;
        return photoId != null && photoId.equals(that.getPhotoId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "PortfolioPhoto{" +
                "photoId=" + photoId +
                ", photoUrl='" + photoUrl + '\'' +
                ", uploadOrder=" + uploadOrder +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
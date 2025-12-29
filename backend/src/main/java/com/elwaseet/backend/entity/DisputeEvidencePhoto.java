package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispute_evidence_photos")
public class DisputeEvidencePhoto {

    /**
     * ============================================================================
     * DISPUTE EVIDENCE PHOTO ENTITY
     * ============================================================================
     * Evidence uploaded by customer or provider during a dispute.
     *
     * RELATIONSHIP SUMMARY:
     * - Many evidence photos → belong to one Dispute
     * - Many evidence photos → uploaded by one User
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to a specific dispute */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispute_id", nullable = false)
    private Dispute dispute;

    /** The user who uploaded this evidence */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @NotBlank(message = "Photo URL is required")
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    @Column(name = "photo_url", nullable = false, length = 500)
    private String photoUrl;

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
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    public DisputeEvidencePhoto() {
    // JPA requires a no-args constructor
}

    public DisputeEvidencePhoto(Dispute dispute, User uploadedBy, String photoUrl) {
        this.dispute = dispute;
        this.uploadedBy = uploadedBy;
        this.photoUrl = photoUrl;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getPhotoId() {
        return photoId;
    }

    public Dispute getDispute() {
        return dispute;
    }

    public void setDispute(Dispute dispute) {
        this.dispute = dispute;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    public void setUploadedAt(LocalDateTime uploadedAt) {
    this.uploadedAt = uploadedAt;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
    */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DisputeEvidencePhoto)) return false;
        DisputeEvidencePhoto that = (DisputeEvidencePhoto) o;
        return photoId != null && photoId.equals(that.getPhotoId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "DisputeEvidencePhoto{" +
                "photoId=" + photoId +
                ", photoUrl='" + photoUrl + '\'' +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
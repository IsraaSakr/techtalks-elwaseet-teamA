package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_photos")
public class ApplicationPhoto {

    /**
     * ============================================================================
     * APPLICATION PHOTO ENTITY
     * ============================================================================
     * Providers can upload additional photos as proof of skill or clarification.
     *
     * RELATIONSHIP SUMMARY:
     * - Many application photos → belong to one Application
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to one application */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @NotBlank(message = "Photo URL is required")
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    @Column(name = "photo_url", nullable = false, length = 500)
    private String photoUrl;

    @Column(name = "upload_order", nullable = false)
    private Integer uploadOrder = 0;  // Schema: upload_order INT DEFAULT 0

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

    protected ApplicationPhoto() {
    }

    public ApplicationPhoto(Application application, String photoUrl) {
        this.application = application;
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

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
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
        if (!(o instanceof ApplicationPhoto)) return false;
        ApplicationPhoto that = (ApplicationPhoto) o;
        return photoId != null && photoId.equals(that.getPhotoId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ApplicationPhoto{" +
                "photoId=" + photoId +
                ", photoUrl='" + photoUrl + '\'' +
                ", uploadOrder=" + uploadOrder +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
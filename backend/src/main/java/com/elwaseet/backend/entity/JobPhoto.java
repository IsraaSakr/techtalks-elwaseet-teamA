package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_photos")
public class JobPhoto {

    /**
     * ============================================================================
     * JOB PHOTO ENTITY
     * ============================================================================
     * Photos uploaded by the customer describing the job request.
     *
     * RELATIONSHIP SUMMARY:
     * - Many photos → belong to one Job
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;

    /** Photo belongs to one Job */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @NotBlank(message = "Photo URL is required")
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    @Column(name = "photo_url", nullable = false, length = 500)
    private String photoUrl;

    /** Used to keep photos ordered in lists */
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

    public JobPhoto() {
    }

    public JobPhoto(Job job, String photoUrl) {
        this.job = job;
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

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
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
        if (!(o instanceof JobPhoto)) return false;
        JobPhoto jobPhoto = (JobPhoto) o;
        return photoId != null && photoId.equals(jobPhoto.getPhotoId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "JobPhoto{" +
                "photoId=" + photoId +
                ", photoUrl='" + photoUrl + '\'' +
                ", uploadOrder=" + uploadOrder +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
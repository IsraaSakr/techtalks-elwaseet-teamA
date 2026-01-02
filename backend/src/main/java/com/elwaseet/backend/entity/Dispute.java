package com.elwaseet.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disputes")
public class Dispute {

    /**
     * ============================================================================
     * DISPUTE ENTITY
     * ============================================================================
     * A dispute is opened when a customer or provider disagrees about:
     * - Job quality
     * - Job completion
     * - Payment release
     *
     * RELATIONSHIP SUMMARY:
     * - One dispute → belongs to one Transaction (UNIQUE)
     * - One dispute → belongs to one Job
     * - One dispute → opened by one User
     * - One dispute → many Evidence Photos
     * - One dispute → zero or one Appeal
     * - One dispute → resolved by one AdminUser (optional)
     */

    // Schema: CREATE TYPE dispute_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'APPEALED');
    public enum DisputeStatus {
        OPEN,
        UNDER_REVIEW,
        RESOLVED,
        APPEALED
    }

    // Schema: CREATE TYPE dispute_reason AS ENUM (...)
    public enum DisputeReason {
        WORK_INCOMPLETE,
        WORK_POOR_QUALITY,
        PROVIDER_NO_SHOW,
        PROVIDER_LATE,
        CUSTOMER_CHANGED_REQUIREMENTS,
        PAYMENT_DISPUTE,
        DAMAGED_PROPERTY,
        SAFETY_ISSUE,
        OTHER
    }

    // Schema: CREATE TYPE dispute_resolution AS ENUM (...)
    public enum DisputeResolution {
        PROVIDER_FULL,
        CUSTOMER_FULL,
        SPLIT,
        FIX_REQUIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dispute_id")
    private Long disputeId;

    /** Transaction the dispute is about (UNIQUE constraint) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    /** Job the dispute is about */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    /** User (customer or provider) who opened this dispute */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by", nullable = false)  // ⚠️ Fixed: was "opened_by_id"
    private User openedBy;

    @NotNull(message = "Reason category is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "reason_category", nullable = false)
    private DisputeReason reasonCategory;

    @NotBlank(message = "Description is required")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DisputeStatus status = DisputeStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution")
    private DisputeResolution resolution;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    /** Admin who resolved this dispute */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private AdminUser resolvedBy;

    @DecimalMin(value = "0.00", message = "Split percentage must be between 0 and 100")
    @DecimalMax(value = "100.00", message = "Split percentage must be between 0 and 100")
    @Column(name = "split_percentage_customer", precision = 5, scale = 2)
    private BigDecimal splitPercentageCustomer;

    @DecimalMin(value = "0.00", message = "Split percentage must be between 0 and 100")
    @DecimalMax(value = "100.00", message = "Split percentage must be between 0 and 100")
    @Column(name = "split_percentage_provider", precision = 5, scale = 2)
    private BigDecimal splitPercentageProvider;

    @Column(name = "opened_at", nullable = false, updatable = false)
    private LocalDateTime openedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "appeal_deadline")
    private LocalDateTime appealDeadline;

    /*
     * ============================================================================
     * RELATIONSHIPS
     * ============================================================================
     */

    /** Evidence photos uploaded for this dispute */
    @OneToMany(
        mappedBy = "dispute", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private List<DisputeEvidencePhoto> evidencePhotos = new ArrayList<>();

    /** Appeal submitted by either party (max one appeal per dispute) */
    @OneToOne(
        mappedBy = "dispute", 
        cascade = CascadeType.ALL, 
        fetch = FetchType.LAZY, 
        orphanRemoval = true
    )
    private DisputeAppeal appeal;

    /*
     * ============================================================================
     * LIFECYCLE CALLBACKS
     * ============================================================================
     */

    @PrePersist
    protected void onCreate() {
        if (openedAt == null) {
            openedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = DisputeStatus.OPEN;
        }
    }

    /*
     * ============================================================================
     * CONSTRUCTORS
     * ============================================================================
     */

    protected Dispute() {
    }

    public Dispute(Transaction transaction, Job job, User openedBy, 
                   DisputeReason reasonCategory, String description) {
        this.transaction = transaction;
        this.job = job;
        this.openedBy = openedBy;
        this.reasonCategory = reasonCategory;
        this.description = description;
    }

    /*
     * ============================================================================
     * GETTERS & SETTERS
     * ============================================================================
     */

    public Long getDisputeId() {
        return disputeId;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getOpenedBy() {
        return openedBy;
    }

    public void setOpenedBy(User openedBy) {
        this.openedBy = openedBy;
    }

    public DisputeReason getReasonCategory() {
        return reasonCategory;
    }

    public void setReasonCategory(DisputeReason reasonCategory) {
        this.reasonCategory = reasonCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DisputeStatus getStatus() {
        return status;
    }

    public void setStatus(DisputeStatus status) {
        this.status = status;
    }

    public DisputeResolution getResolution() {
        return resolution;
    }

    public void setResolution(DisputeResolution resolution) {
        this.resolution = resolution;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public AdminUser getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(AdminUser resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public BigDecimal getSplitPercentageCustomer() {
        return splitPercentageCustomer;
    }

    public void setSplitPercentageCustomer(BigDecimal splitPercentageCustomer) {
        this.splitPercentageCustomer = splitPercentageCustomer;
    }

    public BigDecimal getSplitPercentageProvider() {
        return splitPercentageProvider;
    }

    public void setSplitPercentageProvider(BigDecimal splitPercentageProvider) {
        this.splitPercentageProvider = splitPercentageProvider;
    }

    public LocalDateTime getOpenedAt() {
        return openedAt;
    }
    public void setOpenedAt(LocalDateTime openedAt) {
    this.openedAt = openedAt;
}
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getAppealDeadline() {
        return appealDeadline;
    }

    public void setAppealDeadline(LocalDateTime appealDeadline) {
        this.appealDeadline = appealDeadline;
    }

    public List<DisputeEvidencePhoto> getEvidencePhotos() {
        return evidencePhotos;
    }

    public DisputeAppeal getAppeal() {
        return appeal;
    }

    public void setAppeal(DisputeAppeal appeal) {
        this.appeal = appeal;
    }

    /*
     * ============================================================================
     * BUSINESS LOGIC
     * ============================================================================
     */

    /**
     * Validates split percentages if resolution is SPLIT
     */
    public boolean isValidSplit() {
        if (resolution == DisputeResolution.SPLIT) {
            if (splitPercentageCustomer == null || splitPercentageProvider == null) {
                return false;
            }
            return splitPercentageCustomer.add(splitPercentageProvider)
                .compareTo(BigDecimal.valueOf(100)) == 0;
        }
        return true;
    }

    /*
     * ============================================================================
     * EQUALS, HASHCODE, TOSTRING
     * ============================================================================
     */

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Dispute)) return false;
        Dispute dispute = (Dispute) o;
        return disputeId != null && disputeId.equals(dispute.getDisputeId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Dispute{" +
                "disputeId=" + disputeId +
                ", reasonCategory=" + reasonCategory +
                ", status=" + status +
                ", resolution=" + resolution +
                ", openedAt=" + openedAt +
                ", resolvedAt=" + resolvedAt +
                '}';
    }
}
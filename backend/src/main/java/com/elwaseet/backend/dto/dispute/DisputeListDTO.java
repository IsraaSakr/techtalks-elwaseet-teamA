package com.elwaseet.backend.dto.dispute;

import com.elwaseet.backend.entity.Dispute;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DisputeListDTO {
    private Long disputeId;
    private String status;
    private String reasonCategory;
    private String description;
    private LocalDateTime openedAt;
    private LocalDateTime appealDeadline;
    
    // Transaction info
    private Long transactionId;
    private BigDecimal amount;
    
    // Job info
    private Long jobId;
    private String jobTitle;
    
    // User info
    private Long openedByUserId;
    private String openedByName;
    
    // Appeal info
    private boolean hasAppeal;
    private String appealStatus;
    
    // Resolution info (only if resolved)
    private String resolution;
    private LocalDateTime resolvedAt;
    private String resolvedByName;

    // Constructor from Entity
    public DisputeListDTO(Dispute dispute) {
        this.disputeId = dispute.getDisputeId();
        this.status = dispute.getStatus().name();
        this.reasonCategory = dispute.getReasonCategory().name();
        this.description = dispute.getDescription();
        this.openedAt = dispute.getOpenedAt();
        this.appealDeadline = dispute.getAppealDeadline();
        
        // Transaction
        this.transactionId = dispute.getTransaction().getTransactionId();
        this.amount = dispute.getTransaction().getAmount();
        
        // Job
        this.jobId = dispute.getJob().getJobId();
        this.jobTitle = dispute.getJob().getTitle();
        
        // Opened by
        this.openedByUserId = dispute.getOpenedBy().getUserId();
        this.openedByName = dispute.getOpenedBy().getName();
        
        // Appeal
        this.hasAppeal = dispute.getAppeal() != null;
        this.appealStatus = dispute.getAppeal() != null ? dispute.getAppeal().getAppealStatus().name() : null;
        
        // Resolution
        this.resolution = dispute.getResolution() != null ? dispute.getResolution().name() : null;
        this.resolvedAt = dispute.getResolvedAt();
        this.resolvedByName = dispute.getResolvedBy() != null ? dispute.getResolvedBy().getName() : null;
    }

    // Getters and Setters
    public Long getDisputeId() {
        return disputeId;
    }

    public void setDisputeId(Long disputeId) {
        this.disputeId = disputeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReasonCategory() {
        return reasonCategory;
    }

    public void setReasonCategory(String reasonCategory) {
        this.reasonCategory = reasonCategory;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(LocalDateTime openedAt) {
        this.openedAt = openedAt;
    }

    public LocalDateTime getAppealDeadline() {
        return appealDeadline;
    }

    public void setAppealDeadline(LocalDateTime appealDeadline) {
        this.appealDeadline = appealDeadline;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Long getOpenedByUserId() {
        return openedByUserId;
    }

    public void setOpenedByUserId(Long openedByUserId) {
        this.openedByUserId = openedByUserId;
    }

    public String getOpenedByName() {
        return openedByName;
    }

    public void setOpenedByName(String openedByName) {
        this.openedByName = openedByName;
    }

    public boolean isHasAppeal() {
        return hasAppeal;
    }

    public void setHasAppeal(boolean hasAppeal) {
        this.hasAppeal = hasAppeal;
    }

    public String getAppealStatus() {
        return appealStatus;
    }

    public void setAppealStatus(String appealStatus) {
        this.appealStatus = appealStatus;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedByName() {
        return resolvedByName;
    }

    public void setResolvedByName(String resolvedByName) {
        this.resolvedByName = resolvedByName;
    }

    public String getDescription() {
        return description != null ? description.replace("\"", "") : null;
    }
}

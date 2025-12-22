package com.elwaseet.backend.dto.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponseDTO {
    private Long transactionId;
    private String status;
    private BigDecimal amount;
    private LocalDateTime committedAt;
    private LocalDateTime inProgressAt;
    private LocalDateTime completedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime disputedAt;
    private LocalDateTime resolvedAt;

    // getters & setters
    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getCommittedAt() { return committedAt; }
    public void setCommittedAt(LocalDateTime committedAt) { this.committedAt = committedAt; }

    public LocalDateTime getInProgressAt() { return inProgressAt; }
    public void setInProgressAt(LocalDateTime inProgressAt) { this.inProgressAt = inProgressAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }

    public LocalDateTime getDisputedAt() { return disputedAt; }
    public void setDisputedAt(LocalDateTime disputedAt) { this.disputedAt = disputedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
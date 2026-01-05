package com.elwaseet.backend.dto.transaction;

import java.math.BigDecimal;

public class TransactionRequestDTO {
    private Long jobId;
    private Long customerId;
    private Long providerId;
    private BigDecimal amount;

    // getters & setters
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}

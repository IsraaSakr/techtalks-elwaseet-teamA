package com.elwaseet.backend.dto.dispute;

import com.elwaseet.backend.entity.Dispute.DisputeResolution;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ResolveDisputeRequest {

    @NotNull(message = "Resolution is required")
    private DisputeResolution resolution;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String resolutionNotes;

    // For SPLIT resolution
    @DecimalMin(value = "0.00", message = "Provider split percentage must be at least 0")
    @DecimalMax(value = "100.00", message = "Provider split percentage must be at most 100")
    private BigDecimal providerSplitPercentage;

    @DecimalMin(value = "0.00", message = "Customer split percentage must be at least 0")
    @DecimalMax(value = "100.00", message = "Customer split percentage must be at most 100")
    private BigDecimal customerSplitPercentage;

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

    public BigDecimal getProviderSplitPercentage() {
        return providerSplitPercentage;
    }

    public void setProviderSplitPercentage(BigDecimal providerSplitPercentage) {
        this.providerSplitPercentage = providerSplitPercentage;
    }

    public BigDecimal getCustomerSplitPercentage() {
        return customerSplitPercentage;
    }

    public void setCustomerSplitPercentage(BigDecimal customerSplitPercentage) {
        this.customerSplitPercentage = customerSplitPercentage;
    }
}

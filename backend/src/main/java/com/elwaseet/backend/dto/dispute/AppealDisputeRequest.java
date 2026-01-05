package com.elwaseet.backend.dto.dispute;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AppealDisputeRequest {

    @NotBlank(message = "Appeal reason is required")
    @Size(max = 1000, message = "Appeal reason must not exceed 1000 characters")
    private String appealReason;

    public String getAppealReason() {
        return appealReason;
    }

    public void setAppealReason(String appealReason) {
        this.appealReason = appealReason;
    }
}

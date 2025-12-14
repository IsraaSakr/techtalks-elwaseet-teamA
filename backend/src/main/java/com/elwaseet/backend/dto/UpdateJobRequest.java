package com.elwaseet.backend.dto;

import com.elwaseet.backend.entity.Job;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class UpdateJobRequest {

    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    private String description;

    @Digits(integer = 10, fraction = 2, message = "Invalid budget format")
    private BigDecimal budgetMin;

    @Digits(integer = 10, fraction = 2, message = "Invalid budget format")
    private BigDecimal budgetMax;

    private Job.Urgency urgency;

    /*
     * =============================
     * Getters & Setters
     * =============================
     */

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(BigDecimal budgetMin) {
        this.budgetMin = budgetMin;
    }

    public BigDecimal getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(BigDecimal budgetMax) {
        this.budgetMax = budgetMax;
    }

    public Job.Urgency getUrgency() {
        return urgency;
    }

    public void setUrgency(Job.Urgency urgency) {
        this.urgency = urgency;
    }
}

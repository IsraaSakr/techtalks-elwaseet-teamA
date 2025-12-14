package com.elwaseet.backend.dto;

import com.elwaseet.backend.entity.Job;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class JobResponseDTO {

    private Long jobId;
    private String title;
    private String description;

    private BigDecimal budgetMin;
    private BigDecimal budgetMax;

    private Job.Urgency urgency;
    private Job.JobStatus status;

    private LocalDateTime postedAt;

    /*
     * =============================
     * Getters & Setters
     * =============================
     */

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

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

    public Job.JobStatus getStatus() {
        return status;
    }

    public void setStatus(Job.JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    /*
     * =============================
     * Mapper
     * =============================
     */

    public static JobResponseDTO fromEntity(Job job) {
        JobResponseDTO dto = new JobResponseDTO();
        dto.setJobId(job.getJobId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setBudgetMin(job.getBudgetMin());
        dto.setBudgetMax(job.getBudgetMax());
        dto.setUrgency(job.getUrgency());
        dto.setStatus(job.getStatus());
        dto.setPostedAt(job.getPostedAt());
        return dto;
    }
}

package com.elwaseet.backend.dto.job;

import lombok.*;             
import java.util.List;

import com.elwaseet.backend.dto.user.CustomerDTO;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.JobPhoto;
import com.elwaseet.backend.entity.Location;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponseDTO {

    private Long jobId;
    private String title;
    private String description;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private Job.Urgency urgency;
    private Job.JobStatus status;
    private Location location;
    private LocalDateTime postedAt;
    private List<String> photoUrls;
    private CustomerDTO customer;
    private String category; 
    private Integer applicationCount;

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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public List<String> getPhotoUrls() {
        return photoUrls;
    }

    public void setPhotoUrls(List<String> photoUrls) {
        this.photoUrls = photoUrls;
    }

    public CustomerDTO getCustomer() { 
        return customer; }
    public void setCustomer(CustomerDTO customer) { 
        this.customer = customer; }

    public String getCategory() { 
        return category; }
    public void setCategory(String category) { 
        this.category = category; }

    public Integer getApplicationCount() { 
        return applicationCount; }
    public void setApplicationCount(Integer applicationCount) { 
        this.applicationCount = applicationCount; }

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
        dto.setLocation(job.getLocation());
        dto.setPostedAt(job.getPostedAt());
        
        // Map JobPhoto entities to photo URLs
        List<String> urls = job.getPhotos().stream().map(JobPhoto::getPhotoUrl).collect(Collectors.toList());
        dto.setPhotoUrls(urls);
        
        dto.setCategory(job.getCategories().isEmpty() ? null : 
        job.getCategories().iterator().next().getCategoryName());
        dto.setApplicationCount(job.getApplications().size());
    
        // Customer mapping
        CustomerDTO customerDto = new CustomerDTO();
        customerDto.setId(job.getCustomer().getUserId());
        customerDto.setName(job.getCustomer().getName());
        customerDto.setLocation(job.getCustomer().getLocation().name());
        dto.setCustomer(customerDto);
        
        return dto;
    }
}
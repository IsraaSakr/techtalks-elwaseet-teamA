package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.dto.UpdateJobRequest;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.JobService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.elwaseet.backend.dto.JobRequestDTO;
import org.springframework.http.MediaType;
import java.util.List;
import com.elwaseet.backend.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    /**
     * Update an existing job (text fields only)
     * 
     * Rules:
     * - Only job owner can update
     * - Only OPEN jobs can be updated
     * - Supports partial updates (can update only some fields)
     * - For photo management, use /photos endpoints
     * 
     * @param id Job ID to update
     * @param request Job update data (all fields optional)
     * @param authenticatedUser Currently authenticated user (injected by Spring Security)
     * @return Updated job details
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(
            @PathVariable long id,
            @RequestBody @Valid UpdateJobRequest request,
            @AuthenticationPrincipal User authenticatedUser) {
        
        JobResponseDTO response = jobService.updateJob(
            id, 
            request, 
            null,
            authenticatedUser.getUserId()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Add photos to an existing job
     * 
     * Rules:
     * - Only job owner can add photos
     * - Only OPEN jobs can be modified
     * - Maximum 5 photos total per job
     * - Each photo must be < 5MB
     * - Supported formats: jpg, png, webp
     * 
     * @param id Job ID
     * @param photos Photos to add (multipart/form-data)
     * @param authenticatedUser Currently authenticated user
     * @return Updated job with all photos
     */
    @PostMapping("/{id}/photos")
    public ResponseEntity<JobResponseDTO> addJobPhotos(
            @PathVariable long id,
            @RequestParam("photos") List<MultipartFile> photos,
            @AuthenticationPrincipal User authenticatedUser) {
        
        JobResponseDTO response = jobService.addJobPhotos(
            id,
            photos,
            authenticatedUser.getUserId()
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a specific photo from a job
     * 
     * Rules:
     * - Only job owner can delete photos
     * - Only OPEN jobs can be modified
     * - Photo must belong to this job
     * 
     * @param id Job ID
     * @param photoId Photo ID to delete
     * @param authenticatedUser Currently authenticated user
     * @return Updated job without the deleted photo
     */
    @DeleteMapping("/{id}/photos/{photoId}")
    public ResponseEntity<JobResponseDTO> deleteJobPhoto(
            @PathVariable long id,
            @PathVariable long photoId,
            @AuthenticationPrincipal User authenticatedUser) {
        
        JobResponseDTO response = jobService.deleteJobPhoto(
            id,
            photoId,
            authenticatedUser.getUserId()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable @Positive Long id) {
        JobResponseDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('HYBRID_PROVIDER')")
    public JobResponseDTO createJob(
            @RequestPart("data") JobRequestDTO dto,
            @RequestPart(value = "photos", required = false) MultipartFile[] photos,
            @AuthenticationPrincipal User authenticatedUser) {

        // Pass the authenticated user's email/username to the service
        return jobService.createJob(dto, photos, authenticatedUser.getEmail());
    }

    @GetMapping
    public ResponseEntity<Page<JobResponseDTO>> browseJobs(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Location location,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) Job.Urgency urgency,
            @RequestParam(required = false) Job.JobStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        // Enforce max page size
        if (size > 50) size = 50;

        // Create pageable with default sorting
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? 
            Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<JobResponseDTO> jobs = jobService.browseJobs(
                category,
                location,
                minBudget,
                maxBudget,
                urgency,
                status,
                pageable
        );
        return ResponseEntity.ok(jobs);
    }
}
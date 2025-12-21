package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.application.ApplicationResponseDTO;
import com.elwaseet.backend.dto.application.ApplicationCreateDTO;
import com.elwaseet.backend.entity.Application.ApplicationStatus;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import org.springframework.http.MediaType;
/**
 * REST Controller for job applications
 * 
 * Endpoints:
 * - POST /api/jobs/{jobId}/apply - Apply to job
 * - GET /api/jobs/{jobId}/applications - Get job applications (customer only)
 * - GET /api/applications/my - Get my applications (provider only)
 * - GET /api/applications/{applicationId} - Get single application
 * - DELETE /api/applications/{applicationId} - Cancel application
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    /**
     * Apply to a job
     * POST /api/jobs/{jobId}/apply
     * 
     * Request: multipart/form-data
     * - data: ApplicationCreateDTO (JSON)
     * - photos: MultipartFile[] (max 3)
     */

    @PostMapping(value = "/jobs/{jobId}/apply",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public ResponseEntity<ApplicationResponseDTO> applyToJob(
        @PathVariable Long jobId,
        @RequestPart("data") @Valid ApplicationCreateDTO request,
        @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
        Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        Long providerId = currentUser.getUserId();
        
        ApplicationResponseDTO response = applicationService.createApplication(
            jobId, 
            providerId, 
            request, 
            photos
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all applications for a job (customer view)
     * GET /api/jobs/{jobId}/applications
     * 
     * Only the job owner (customer) can view applications
     */
    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicationResponseDTO>> getJobApplications(
            @PathVariable Long jobId,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        Long customerId = currentUser.getUserId();

        List<ApplicationResponseDTO> applications =
                applicationService.getJobApplications(jobId, customerId);

        return ResponseEntity.ok(applications);
    }

    /**
     * Accept an application for a job
     * POST /api/jobs/{jobId}/accept/{providerId}
     * 
     * Security: Requires CUSTOMER role. The authenticated user must own the job.
     * 
     * Path Variables:
     * - jobId: ID of the job
     * - providerId: ID of the provider whose application to accept
     * 
     * Response:
     * {
     *   "applicationId": 123,
     *   "jobId": 789,
     *   "jobTitle": "Fix plumbing",
     *   "providerId": 101,
     *   "providerName": "John Doe",
     *   "quotedPrice": 150.00,
     *   "availability": "Available this weekend",
     *   "message": "I have 5 years experience",
     *   "status": "ACCEPTED",
     *   "appliedAt": "2025-12-19T10:30:00",
     *   "updatedAt": "2025-12-20T05:36:00"
     * }
     * 
     * @param jobId ID of the job
     * @param providerId ID of the provider whose application to accept
     * @return ApplicationResponseDTO with updated application details
     */
    @PostMapping("/jobs/{jobId}/accept/{providerId}")
    public ResponseEntity<ApplicationResponseDTO> acceptApplication(
            @PathVariable Long jobId,
            @PathVariable Long providerId,
            Authentication authentication) {
        
        return ResponseEntity.ok(applicationService.acceptApplication(jobId, providerId));
    }
        
    /**
     * Get my applications (provider view)
     * GET /api/applications/my
     * 
     * Query parameters:
     * - status: ApplicationStatus (optional filter)
     * - page: int (default 0)
     * - size: int (default 10)
     */
    @GetMapping("/applications/my")
    public ResponseEntity<Page<ApplicationResponseDTO>> getMyApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Long providerId = currentUser.getUserId();
        
        Page<ApplicationResponseDTO> applications = applicationService.getProviderApplications(
            providerId, 
            status, 
            page, 
            size
        );
        
        return ResponseEntity.ok(applications);
    }

    /**
     * Get single application details
     * GET /api/applications/{applicationId}
     * 
     * Can be viewed by:
     * - Provider who submitted the application
     * - Customer who owns the job
     */
    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApplicationResponseDTO> getApplication(
        @PathVariable Long applicationId,
        Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Long userId = currentUser.getUserId();
        
        ApplicationResponseDTO application = applicationService.getApplication(applicationId, userId);
        
        return ResponseEntity.ok(application);
    }

    /**
     * Cancel application (provider only)
     * DELETE /api/applications/{applicationId}
     * 
     * Only the provider who submitted can cancel
     * Only possible if status is PENDING
     */
    @DeleteMapping("/applications/{applicationId}")
    public ResponseEntity<Void> cancelApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Long providerId = currentUser.getUserId();
        
        applicationService.cancelApplication(applicationId, providerId);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * Get application count for a job (public endpoint for job cards)
     * GET /api/jobs/{jobId}/applications/count
     * 
     * Returns total and pending application counts
     */
    @GetMapping("/jobs/{jobId}/applications/count")
    public ResponseEntity<ApplicationCountResponse> getApplicationCount(@PathVariable Long jobId) {
        
        long totalCount = applicationService.getApplicationCount(jobId);
        long pendingCount = applicationService.getPendingApplicationCount(jobId);
        
        return ResponseEntity.ok(new ApplicationCountResponse(totalCount, pendingCount));
    }

    /**
     * Response DTO for application count
     */
    public static class ApplicationCountResponse {
        private long totalApplications;
        private long pendingApplications;
        
        public ApplicationCountResponse(long totalApplications, long pendingApplications) {
            this.totalApplications = totalApplications;
            this.pendingApplications = pendingApplications;
        }
        
        // Getters
        public long getTotalApplications() { return totalApplications; }
        public long getPendingApplications() { return pendingApplications; }
    }

    /**
     * Search applications (advanced - optional)
     * GET /api/applications/search
     * 
     * Query parameters:
     * - jobId: Long (optional)
     * - status: ApplicationStatus (optional)
     * - page: int (default 0)
     * - size: int (default 10)
     */
    @GetMapping("/applications/search")
    public ResponseEntity<Page<ApplicationResponseDTO>> searchApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Long userId = currentUser.getUserId();
        
        // For now, redirect to my applications
        Page<ApplicationResponseDTO> applications = applicationService.getProviderApplications(
            userId, 
            status, 
            page, 
            size
        );
        
        return ResponseEntity.ok(applications);
    }
}
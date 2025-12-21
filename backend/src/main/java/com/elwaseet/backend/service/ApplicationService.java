package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.application.ApplicationResponseDTO;
import com.elwaseet.backend.dto.application.ApplicationCreateDTO;
import com.elwaseet.backend.entity.*;
import com.elwaseet.backend.entity.Application.ApplicationStatus;
import com.elwaseet.backend.entity.Job.JobStatus;
import com.elwaseet.backend.exception.*;
import com.elwaseet.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import java.util.Optional;

/**
 * Service for managing job applications
 * 
 * TASK SCOPE:
 * - POST /api/jobs/{id}/apply - Apply to job
 * - GET /api/jobs/{id}/applications - Get job applications 
 * - GET /api/applications/my - Get my applications
 */
@Slf4j
@Service
@Transactional
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private EmailService emailService;

    /**
     * Create a new job application
     * 
     * Business Rules:
     * - One application per provider per job
     * - Quote must be within job budget range
     * - Only providers can apply
     * - Cannot apply to own job
     * - Cannot apply if job not OPEN
     * - Max 3 photos
     */
    public ApplicationResponseDTO createApplication(Long jobId, Long providerId, 
                                                   ApplicationCreateDTO request,
                                                   List<MultipartFile> photos) {
        
        // STEP 1: Get job and validate it's OPEN
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));
        
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new ValidationException("Cannot apply to closed job. Current status: " + job.getStatus());
        }
        
        // STEP 2: Get provider and validate exists
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));
        
        // STEP 3: Validate provider is not the job owner
        if (job.getCustomer().getUserId().equals(providerId)) {
            throw new ValidationException("Cannot apply to your own job");
        }

        // STEP 4: Check if provider has an ACTIVE application (not cancelled/rejected)
        Optional<Application> existingApplication = applicationRepository
            .findByJobIdAndProviderId(jobId, providerId);

        if (existingApplication.isPresent()) {
            Application existing = existingApplication.get();
            
            // Block if there's an active PENDING application
            if (existing.getStatus() == ApplicationStatus.PENDING) {
                throw new ConflictException("You have already applied to this job. Please wait for the customer's response.");
            }
            
            // Block if application was ACCEPTED
            if (existing.getStatus() == ApplicationStatus.ACCEPTED) {
                throw new ConflictException("Your application has already been accepted for this job.");
            }
            
            // If REJECTED or CANCELLED - delete the old record and allow fresh reapplication
            if (existing.getStatus() == ApplicationStatus.REJECTED || 
                existing.getStatus() == ApplicationStatus.CANCELLED) {
                applicationRepository.delete(existing);
                applicationRepository.flush(); // Force delete before creating new one
            }
        }
        
        // STEP 5: Validate quote is within budget
        if (request.getQuotedPrice().compareTo(job.getBudgetMin()) < 0 || 
            request.getQuotedPrice().compareTo(job.getBudgetMax()) > 0) {
            throw new ValidationException("Quote must be between $" + job.getBudgetMin() + 
                                        " and $" + job.getBudgetMax());
        }
        
        // STEP 6: Create application
        Application application = new Application(job, provider, request.getQuotedPrice());
        application.setMessage(request.getMessage());
        application.setAvailability(request.getAvailability());
        application.setStatus(ApplicationStatus.PENDING);
        
        // Save application first to get ID
        application = applicationRepository.save(application);
        
        // STEP 7: Handle photo uploads (max 3)
        if (photos != null && !photos.isEmpty()) {
            if (photos.size() > 3) {
                throw new ValidationException("Maximum 3 photos allowed per application");
            }
            
            List<String> photoUrls = fileStorageService.saveMultipleFiles(
                photos, 
                "applications", 
                3  // max count
            );
            
            // Create ApplicationPhoto entities
            for (int i = 0; i < photoUrls.size(); i++) {
                ApplicationPhoto photo = new ApplicationPhoto(application, photoUrls.get(i));
                photo.setUploadOrder(i + 1);
                application.addPhoto(photo);
            }
            
            // Save again with photos
            application = applicationRepository.save(application);
        }
        
        // STEP 8: Send email notification to customer
        try {
            emailService.sendApplicationNotification(
                job.getCustomer().getEmail(),
                job.getTitle(),
                provider.getName(),
                request.getQuotedPrice()
            );
        } catch (Exception e) {
            // Log error but don't fail the application
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
        
        // STEP 9: Convert to DTO and return
        return ApplicationResponseDTO.fromEntity(application);
    }

    /**
     * Get all applications for a specific job (for customer to review)
     */
    @Transactional(readOnly = true)
    public List<ApplicationResponseDTO> getJobApplications(Long jobId, Long customerId) {
        
        // Verify job exists and belongs to customer
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));
        
        if (!job.getCustomer().getUserId().equals(customerId)) {
            throw new UnauthorizedException("You can only view applications for your own jobs");
        }
        
        List<Application> applications = applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
        
        return applications.stream()
                .map(ApplicationResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get applications by provider (My Applications page)
     */
    @Transactional(readOnly = true)
    public Page<ApplicationResponseDTO> getProviderApplications(Long providerId, 
                                                               ApplicationStatus status,
                                                               int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Page<Application> applications;
        if (status != null) {
            applications = applicationRepository.findByProviderIdAndStatus(providerId, status, pageable);
        } else {
            applications = applicationRepository.findByProviderId(providerId, pageable);
        }
        
        return applications.map(ApplicationResponseDTO::fromEntity);
    }

    /**
     * Get single application by ID
     */
    @Transactional(readOnly = true)
    public ApplicationResponseDTO getApplication(Long applicationId, Long userId) {
        
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));
        
        // Check permissions: only provider who applied or job owner can view
        if (!application.getProvider().getUserId().equals(userId) && 
            !application.getJob().getCustomer().getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to view this application");
        }
        
        return ApplicationResponseDTO.fromEntity(application);
    }

    /**
     * Cancel application (only by provider, only if PENDING)
     */
    public void cancelApplication(Long applicationId, Long providerId) {
        
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));
        
        // Check permissions
        if (!application.getProvider().getUserId().equals(providerId)) {
            throw new UnauthorizedException("You can only cancel your own applications");
        }
        
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ValidationException("Can only cancel pending applications. Current status: " + application.getStatus());
        }
        
        application.setStatus(ApplicationStatus.CANCELLED);
        applicationRepository.save(application);
    }

    /**
     * Get application count for job (used for job cards showing "X applications")
     */
    @Transactional(readOnly = true)
    public long getApplicationCount(Long jobId) {
        return applicationRepository.countByJobId(jobId);
    }

    /**
     * Get pending applications count for job
     */
    @Transactional(readOnly = true)
    public long getPendingApplicationCount(Long jobId) {
        return applicationRepository.countByJobIdAndStatus(jobId, ApplicationStatus.PENDING);
    }

    /**
     * Accept an application for a job
     * 
     * Business Rules:
     * 1. Only job owner can accept applications (verified via authenticated user)
     * 2. Job must be OPEN (not closed/completed)
     * 3. Application must be PENDING (not already accepted/rejected)
     * 4. Only ONE application can be accepted per job
     * 
     * Side Effects:
     * - Accepts the specified application
     * - Rejects all other pending applications for the same job
     * - Updates job status to IN_REVIEW (not IN_PROGRESS - that happens when work starts)
     * - Sets job.acceptedApplication reference
     * - Sets job.startedAt timestamp
     * 
     * Security:
     * - Gets authenticated user from SecurityContext (cannot be spoofed)
     * - Validates user owns the job before accepting application
     * 
     * @param jobId ID of the job
     * @param providerId ID of the provider whose application to accept
     * @return ApplicationResponseDTO with updated application details
     * @throws IllegalArgumentException if validation fails
     * @throws IllegalStateException if user is not authenticated
     */
    @Transactional
    public ApplicationResponseDTO acceptApplication(Long jobId, Long providerId) {

        // STEP 1: Get authenticated user from security context
        User authenticatedUser = getAuthenticatedUser();

        // STEP 2: Find application by jobId AND providerId
        Application application = applicationRepository
                .findByJobIdAndProviderId(jobId, providerId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Application not found for job " + jobId + " and provider " + providerId));

        Job job = application.getJob();

        // STEP 3: Verify authenticated user owns the job
        if (!job.getCustomer().getUserId().equals(authenticatedUser.getUserId())) {
            throw new IllegalArgumentException(
                    "Only the job owner can accept applications. You do not own job ID " + job.getJobId());
        }

        // STEP 4: Validate job is OPEN
        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException(
                    "Cannot accept application. Job status is " + job.getStatus() +
                            " but must be OPEN. Job ID: " + job.getJobId());
        }

        // STEP 5: Validate application is PENDING
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Cannot accept application. Application status is " + application.getStatus() +
                            " but must be PENDING. Application ID: " + application.getApplicationId());
        }

        // STEP 6: Check if job already has an accepted application
        if (applicationRepository.findAcceptedApplicationByJobId(job.getJobId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Job already has an accepted application. Only ONE application can be accepted per job. Job ID: " +
                            job.getJobId());
        }

        // STEP 7: Accept this application
        // Note: updatedAt is automatically set by @PreUpdate in Application entity
        application.setStatus(ApplicationStatus.ACCEPTED);
        applicationRepository.save(application);

        // STEP 8: Reject all other pending applications for this job
        List<Application> pendingApplications = applicationRepository
                .findPendingApplicationsByJobId(job.getJobId());

        for (Application pendingApp : pendingApplications) {
            if (!pendingApp.getApplicationId().equals(application.getApplicationId())) {
                pendingApp.setStatus(ApplicationStatus.REJECTED);
                // updatedAt is automatically set by @PreUpdate
                applicationRepository.save(pendingApp);
            }
        }

        // STEP 9: Update job status to IN_REVIEW (not IN_PROGRESS!)
        // IN_REVIEW = application accepted, waiting for escrow/work to start
        // IN_PROGRESS = work has actually started
        job.setStatus(JobStatus.IN_REVIEW);
        job.setAcceptedApplication(application);
        job.setStartedAt(LocalDateTime.now());
        jobRepository.save(job);

        // STEP 10: Send notifications (async)
        try {
            // Send acceptance email to the accepted provider
            emailService.sendApplicationAcceptedEmail(
                application.getProvider().getEmail(),
                application.getProvider().getName(),
                job.getTitle()
            );
            
            // Send rejection emails to other providers (async - won't slow down response)
            for (Application rejectedApp : pendingApplications) {
                if (!rejectedApp.getApplicationId().equals(application.getApplicationId())) {
                    emailService.sendApplicationRejectedEmail(
                        rejectedApp.getProvider().getEmail(),
                        rejectedApp.getProvider().getName(),
                        job.getTitle()
                    );
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the transaction
            // Emails are best-effort, not critical to business logic
            log.error("Failed to send notification emails for job {}: {}", job.getJobId(), e.getMessage());
        }

        // Return response DTO
        return ApplicationResponseDTO.fromEntity(application);
    }

    /**
     * Get the currently authenticated user from Spring Security context
     * 
     * @return The authenticated User entity
     * @throws IllegalStateException if no user is authenticated
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new IllegalStateException("Invalid authentication principal");
        }

        return (User) principal;
    }
}
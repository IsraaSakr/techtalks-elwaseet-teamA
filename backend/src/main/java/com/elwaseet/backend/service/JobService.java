package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.dto.UpdateJobRequest;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.JobPhoto;
import com.elwaseet.backend.exception.BadRequestException;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.UnauthorizedException;
import com.elwaseet.backend.repository.JobPhotoRepository;
import com.elwaseet.backend.repository.JobRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elwaseet.backend.dto.JobRequestDTO;
import com.elwaseet.backend.entity.ServiceCategory;
import com.elwaseet.backend.repository.UserRepository; 
import com.elwaseet.backend.entity.User; 
import com.elwaseet.backend.repository.ServiceCategoryRepository;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobPhotoRepository jobPhotoRepository;
    private final FileStorageService fileStorageService;
    private final JobRepository jobs;
    private final FileStorageService storage;
    private final UserRepository users;
    private final ServiceCategoryRepository categoryRepository;
    /**
     * Update job text fields (no photos)
     */
    @Transactional
    public JobResponseDTO updateJob(
            long jobId,
            UpdateJobRequest request,
            List<MultipartFile> photos,
            long userId) {

        // 1️⃣ Get job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // 2️⃣ Verify ownership
        if (!job.getCustomer().getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot update this job");
        }

        // 3️⃣ Verify status is OPEN
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new BadRequestException("Job must be OPEN to be updated");
        }

        // 4️⃣ ATOMIC BUDGET VALIDATION
        BigDecimal finalMin = request.getBudgetMin() != null 
            ? request.getBudgetMin() 
            : job.getBudgetMin();
            
        BigDecimal finalMax = request.getBudgetMax() != null 
            ? request.getBudgetMax() 
            : job.getBudgetMax();

        if (finalMin.compareTo(finalMax) >= 0) {
            throw new BadRequestException(
                "Budget minimum (" + finalMin + ") must be less than maximum (" + finalMax + ")"
            );
        }

        // 5️⃣ Update text fields (only if provided)
        if (request.getTitle() != null)
            job.setTitle(request.getTitle());

        if (request.getDescription() != null)
            job.setDescription(request.getDescription());

        if (request.getBudgetMin() != null)
            job.setBudgetMin(request.getBudgetMin());

        if (request.getBudgetMax() != null)
            job.setBudgetMax(request.getBudgetMax());

        if (request.getUrgency() != null)
            job.setUrgency(request.getUrgency());

        if (request.getLocation() != null)
            job.setLocation(request.getLocation());

        // 6️⃣ Save and return
        Job updatedJob = jobRepository.save(job);
        return JobResponseDTO.fromEntity(updatedJob);
    }

    /**
     * Add photos to job (without deleting existing ones)
     */
    @Transactional
    public JobResponseDTO addJobPhotos(
            long jobId,
            List<MultipartFile> photos,
            long userId) {

        // 1️⃣ Get job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // 2️⃣ Verify ownership
        if (!job.getCustomer().getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot update this job");
        }

        // 3️⃣ Verify status is OPEN
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new BadRequestException("Job must be OPEN to be updated");
        }

        // 4️⃣ Validate photos
        if (photos == null || photos.isEmpty()) {
            throw new BadRequestException("At least one photo is required");
        }

        // 5️⃣ Check total count doesn't exceed 5
        int currentPhotoCount = job.getPhotos().size();
        int newPhotoCount = photos.size();
        int totalCount = currentPhotoCount + newPhotoCount;

        if (totalCount > 5) {
            throw new BadRequestException(
                "Cannot add " + newPhotoCount + " photos. Job already has " + 
                currentPhotoCount + " photos. Maximum is 5 total."
            );
        }

        // 6️⃣ Save new photos
        for (int i = 0; i < photos.size(); i++) {
            String photoUrl = fileStorageService.saveFile(photos.get(i), "jobs");
            
            JobPhoto jobPhoto = new JobPhoto(job, photoUrl);
            // uploadOrder continues from existing photos
            jobPhoto.setUploadOrder(currentPhotoCount + i);
            job.getPhotos().add(jobPhoto);
        }

        // 7️⃣ Save and return
        Job updatedJob = jobRepository.save(job);
        return JobResponseDTO.fromEntity(updatedJob);
    }

    /**
     * Delete a specific photo from job
     */
    @Transactional
    public JobResponseDTO deleteJobPhoto(
            long jobId,
            long photoId,
            long userId) {

        // 1️⃣ Get job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // 2️⃣ Verify ownership
        if (!job.getCustomer().getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot update this job");
        }

        // 3️⃣ Verify status is OPEN
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new BadRequestException("Job must be OPEN to be updated");
        }

        // 4️⃣ Find the photo
        JobPhoto photoToDelete = jobPhotoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));

        // 5️⃣ Verify photo belongs to this job
        if (!photoToDelete.getJob().getJobId().equals(jobId)) {
            throw new BadRequestException("Photo does not belong to this job");
        }

        // 6️⃣ Delete from filesystem
        fileStorageService.deleteFile(photoToDelete.getPhotoUrl());

        // 7️⃣ Remove from database
        job.getPhotos().remove(photoToDelete);
        jobPhotoRepository.delete(photoToDelete);

        // 8️⃣ Save and return
        Job updatedJob = jobRepository.save(job);
        return JobResponseDTO.fromEntity(updatedJob);
    }

    @Transactional
    public JobResponseDTO getJobById(Long id) {
        if (id == null) {
        throw new BadRequestException("Job ID cannot be null");
        }
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        
        return JobResponseDTO.fromEntity(job);
    }


    public JobResponseDTO createJob(JobRequestDTO dto, MultipartFile[] photos, String customerEmail) {
        // Validation
        if (dto.getBudgetMin() >= dto.getBudgetMax())
            throw new IllegalArgumentException("budgetMin must be less than budgetMax");
        if (photos != null && photos.length > 5)
            throw new IllegalArgumentException("Max 5 photos allowed");

        User customer = users.findByEmail(customerEmail)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Long categoryId = dto.getCategoryId();
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }

        ServiceCategory category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Save job first
        Job job = new Job(
            customer,
            dto.getTitle(),
            dto.getDescription(),
            BigDecimal.valueOf(dto.getBudgetMin()),   // convert Double → BigDecimal
            BigDecimal.valueOf(dto.getBudgetMax()),
            dto.getLocation(),
            dto.getUrgency()     
        );
        job.setStatus(Job.JobStatus.OPEN);
        job.getCategories().add(category);

        job = jobs.save(job);

        // Save photos
        List<String> photoUrls = new ArrayList<>();
        if (photos != null) {
            for (MultipartFile photo : photos) {
                if (photo.getSize() > 5 * 1024 * 1024)
                    throw new IllegalArgumentException("File too large");
                String type = photo.getContentType();
                if (type == null || !List.of("image/jpeg","image/png","image/webp").contains(type))
                    throw new IllegalArgumentException("Invalid file type");
                String photoUrl = storage.saveFile(photo, "jobs");
                photoUrls.add(photoUrl);
            }

            for (String photoUrl : photoUrls) {
                JobPhoto jobPhoto = new JobPhoto();
                jobPhoto.setJob(job);
                jobPhoto.setPhotoUrl(photoUrl);
                job.getPhotos().add(jobPhoto);
            }
        }

        // Build response DTO
        return JobResponseDTO.builder()
                .jobId(job.getJobId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .urgency(job.getUrgency())
                .budgetMin(job.getBudgetMin())
                .budgetMax(job.getBudgetMax())
                .status(job.getStatus())
                .photoUrls(photoUrls)
                .build();
    }
}



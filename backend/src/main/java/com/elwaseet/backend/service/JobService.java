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

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobPhotoRepository jobPhotoRepository;
    private final FileStorageService fileStorageService;

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
}
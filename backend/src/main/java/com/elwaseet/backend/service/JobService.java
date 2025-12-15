package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.dto.UpdateJobRequest;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.JobPhoto;
import com.elwaseet.backend.exception.BadRequestException;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.UnauthorizedException;
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
    private final FileStorageService fileStorageService;

    @Transactional
    public JobResponseDTO updateJob(
            long jobId,
            UpdateJobRequest request,
            List<MultipartFile> photos,
            long userId) {

        // 1. Get job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // 2️. Verify ownership
        if (!job.getCustomer().getUserId().equals(userId)) {
            throw new UnauthorizedException("You cannot update this job");
        }

        // 3️. Verify status is OPEN
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new BadRequestException("Job must be OPEN to be updated");
        }

        // 4️. Get final values (new if provided, otherwise existing)
        BigDecimal finalMin = request.getBudgetMin() != null 
            ? request.getBudgetMin() 
            : job.getBudgetMin();
            
        BigDecimal finalMax = request.getBudgetMax() != null 
            ? request.getBudgetMax() 
            : job.getBudgetMax();

        // Validate final state to prevent invalid partial updates
        if (finalMin.compareTo(finalMax) >= 0) {
            throw new BadRequestException(
                "Budget minimum (" + finalMin + ") must be less than maximum (" + finalMax + ")"
            );
        }

        // 5️. Update text fields (only if provided - partial update pattern)
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

        // 6️. Handle photo updates (OPTION B: Replace all if provided)
        if (photos != null && !photos.isEmpty()) {
            
            // Validate photo count
            if (photos.size() > 5) {
                throw new BadRequestException("Maximum 5 photos allowed");
            }

            // Delete old photos from filesystem and database
            List<JobPhoto> oldPhotos = job.getPhotos();
            if (oldPhotos != null && !oldPhotos.isEmpty()) {
                for (JobPhoto oldPhoto : oldPhotos) {
                    // FileStorageService.deleteFile() already handles "file not found" gracefully
                    fileStorageService.deleteFile(oldPhoto.getPhotoUrl());
                }
                // Clear collection - orphanRemoval will delete JobPhoto entities from DB
                oldPhotos.clear();
            }

            // Save new photos
            for (int i = 0; i < photos.size(); i++) {
                String photoUrl = fileStorageService.saveFile(photos.get(i), "jobs");
                
                JobPhoto jobPhoto = new JobPhoto(job, photoUrl);
                jobPhoto.setUploadOrder(i);
                job.getPhotos().add(jobPhoto);
            }
        }

        // 7️⃣ Save and return
        Job updatedJob = jobRepository.save(job);

        return JobResponseDTO.fromEntity(updatedJob);
    }
}
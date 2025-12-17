package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.JobRequestDTO;
import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.JobPhoto;
import com.elwaseet.backend.entity.ServiceCategory;
import com.elwaseet.backend.repository.JobRepository;
import com.elwaseet.backend.repository.UserRepository; 
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elwaseet.backend.entity.User; 
import com.elwaseet.backend.repository.ServiceCategoryRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobs;
    private final FileStorageService storage;
    private final UserRepository users;
    private final ServiceCategoryRepository categoryRepository;

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
                .id(job.getJobId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation().name())
                .urgency(job.getUrgency().name())
                .budgetMin(job.getBudgetMin().doubleValue()) // BigDecimal → double
                .budgetMax(job.getBudgetMax().doubleValue())
                .status(job.getStatus().name())
                .photoUrls(photoUrls)
                .build();
    }
}



package com.elwaseet.backend.service.impl;


import com.elwaseet.backend.dto.JobRequestDTO;
import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.Location;
import com.elwaseet.backend.repository.JobRepository;
import com.elwaseet.backend.repository.UserRepository;
import com.elwaseet.backend.storage.IFileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.elwaseet.backend.entity.User; 

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobs;
    private final IFileStorageService storage;
    private final UserRepository users;

    public JobResponseDTO createJob(JobRequestDTO dto, MultipartFile[] photos, String customerEmail) {
        // Validation
        if (dto.getBudgetMin() >= dto.getBudgetMax())
            throw new IllegalArgumentException("budgetMin must be less than budgetMax");
        if (photos != null && photos.length > 5)
            throw new IllegalArgumentException("Max 5 photos allowed");

        Location locationEnum = Location.valueOf(dto.getLocation().toUpperCase().replace(" ", "_"));
        User customer = users.findByEmail(customerEmail)
    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Save job first
Job job = new Job(
    customer,
    dto.getTitle(),
    dto.getDescription(),
    BigDecimal.valueOf(dto.getBudgetMin()),   // convert Double → BigDecimal
    BigDecimal.valueOf(dto.getBudgetMax()),
    locationEnum,
        // depends on how your Location entity/VO is defined
    Job.Urgency.valueOf(dto.getUrgency())     // convert String → enum
);
job.setStatus(Job.JobStatus.OPEN);


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
                photoUrls.add(storage.saveJobPhoto(job.getJobId(), photo));
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



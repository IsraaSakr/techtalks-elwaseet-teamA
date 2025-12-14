package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.dto.UpdateJobRequest;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.exception.BadRequestException;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.UnauthorizedException;
import com.elwaseet.backend.repository.JobRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    @Transactional
    public JobResponseDTO updateJob(
            Long jobId,
            UpdateJobRequest request,
            Long customerId) {

        // 1️⃣ Get job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // 2️⃣ Verify ownership
        if (!job.getCustomer().getUserId().equals(customerId)) {
            throw new UnauthorizedException("You cannot update this job");
        }

        // 3️⃣ Verify status is OPEN
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new BadRequestException("Job must be OPEN to be updated");
        }

        // 4️⃣ Validate budget range
        if (request.getBudgetMin() != null && request.getBudgetMax() != null) {
            if (request.getBudgetMin().compareTo(request.getBudgetMax()) >= 0) {
                throw new BadRequestException(
                        "budgetMin must be less than budgetMax");
            }
        }

        // 5️⃣ Update allowed fields
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

        // 6️⃣ Save and return
        Job updatedJob = jobRepository.save(job);

        return JobResponseDTO.fromEntity(updatedJob);
    }
}

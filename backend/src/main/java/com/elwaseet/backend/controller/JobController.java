package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.dto.UpdateJobRequest;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    /**
     * Update an existing job
     * 
     * Rules:
     * - Only job owner can update
     * - Only OPEN jobs can be updated
     * - Supports partial updates (can update only some fields)
     * - If photos provided, replaces all existing photos
     * 
     * @param id Job ID to update
     * @param request Job update data (all fields optional)
     * @param photos New photos (optional, replaces all if provided, max 5)
     * @param authenticatedUser Currently authenticated user (injected by Spring Security)
     * @return Updated job details
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(
            @PathVariable Long id,
            @RequestPart("data") @Valid UpdateJobRequest request,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            @AuthenticationPrincipal User authenticatedUser) {
        
        JobResponseDTO response = jobService.updateJob(
            id, 
            request, 
            photos, 
            authenticatedUser.getUserId()
        );
        
        return ResponseEntity.ok(response);
    }
}
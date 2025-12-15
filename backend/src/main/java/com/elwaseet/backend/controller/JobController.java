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
}
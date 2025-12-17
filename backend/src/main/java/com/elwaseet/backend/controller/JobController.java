package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.JobRequestDTO;
import com.elwaseet.backend.dto.JobResponseDTO;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('HYBRID_PROVIDER')")
    public JobResponseDTO createJob(
            @RequestPart("data") JobRequestDTO dto,
            @RequestPart(value = "photos", required = false) MultipartFile[] photos,
            @AuthenticationPrincipal User authenticatedUser) {

        // Pass the authenticated user's email/username to the service
        return jobService.createJob(dto, photos, authenticatedUser.getEmail());
    }
}
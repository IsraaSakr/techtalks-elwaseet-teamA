package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.service.AddServiceRequest;
import com.elwaseet.backend.dto.service.ServiceDTO;
import com.elwaseet.backend.dto.user.ProviderProfileResponseDTO;
import com.elwaseet.backend.dto.user.UpdateProfileRequest;
import com.elwaseet.backend.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.elwaseet.backend.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.Map;
import java.util.List;

/**
 * REST controller responsible for managing the authenticated provider's profile.
 * 
 * This includes updating profile details, managing offered services,
 * and handling portfolio image uploads and deletions.
 * 
 * REFACTORED: Now uses the updated ProviderProfileService that leverages 
 * LocalFileStorageService for consistent file handling.
 */
@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
@Slf4j
public class ProviderProfileController {

    /** 
     * Service layer handling provider profile business logic.
     * Now uses LocalFileStorageService for consistency.
     */
    private final ProviderProfileService providerProfileService;

    /**
     * Updates the provider's profile information.
     *
     * @param userId  ID of the authenticated user
     * @param request DTO containing updated profile data
     * @return updated provider profile information
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public ResponseEntity<ProviderProfileResponseDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {

        ProviderProfileResponseDTO response =
                providerProfileService.updateProfile(user.getUserId(), request);

        return ResponseEntity.ok(response);
    }

    /**
     * Adds a new service offered by the provider.
     *
     * @param userId  ID of the authenticated user
     * @param request DTO containing service details
     * @return the newly created service
     */
    @PostMapping("/services")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public ResponseEntity<ServiceDTO> addService(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddServiceRequest request) {

        ServiceDTO response =
                providerProfileService.addService(user.getUserId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Uploads portfolio images for the provider.
     * Now uses LocalFileStorageService for consistent file handling and validation.
     *
     * @param userId ID of the authenticated user
     * @param photos list of image files to be added to the portfolio
     * @return updated provider profile including portfolio images
     */
    @PostMapping("/portfolio")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public ResponseEntity<ProviderProfileResponseDTO> uploadPortfolioPhotos(
            @AuthenticationPrincipal User user,
            @RequestParam("photos") List<MultipartFile> photos) {

        ProviderProfileResponseDTO response =
                providerProfileService.uploadPortfolioPhotos(user.getUserId(), photos);

        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a service offered by the provider.
     * DELETE /api/users/me/services/{serviceId}
     *
     * @param user      the authenticated provider user (from JWT)
     * @param serviceId ID of the service to be deleted
     * @return HTTP 204 if deletion is successful
     */
    @DeleteMapping("/services/{serviceId}")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public ResponseEntity<Void> deleteService(
            @AuthenticationPrincipal User user,
            @PathVariable Long serviceId) {

        providerProfileService.deleteService(user.getUserId(), serviceId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Deletes a specific portfolio image by its URL.
     * DELETE /api/users/me/portfolio
     * Body: { "photoUrl": "/uploads/portfolios/..." }
     *
     * @param user     the authenticated provider user (from JWT)
     * @param request  JSON containing photoUrl to delete
     * @return HTTP 204 if deletion is successful
     */
    @DeleteMapping("/portfolio")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public ResponseEntity<Void> deletePortfolioPhoto(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) {

        String photoUrl = request.get("photoUrl");
        if (photoUrl == null || photoUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        providerProfileService.deletePortfolioPhoto(user.getUserId(), photoUrl);
        return ResponseEntity.noContent().build();
    }
}
package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.AddServiceRequest;
import com.elwaseet.backend.dto.UpdateProfileRequest;
import com.elwaseet.backend.dto.ProviderProfileResponseDTO;
import com.elwaseet.backend.dto.ServiceDTO;
import com.elwaseet.backend.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<ProviderProfileResponseDTO> updateProfile(
            @RequestParam Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {

        ProviderProfileResponseDTO response =
                providerProfileService.updateProfile(userId, request);

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
    public ResponseEntity<ServiceDTO> addService(
            @RequestParam Long userId,
            @Valid @RequestBody AddServiceRequest request) {

        ServiceDTO response =
                providerProfileService.addService(userId, request);

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
    public ResponseEntity<ProviderProfileResponseDTO> uploadPortfolioPhotos(
            @RequestParam Long userId,
            @RequestParam("photos") List<MultipartFile> photos) {

        ProviderProfileResponseDTO response =
                providerProfileService.uploadPortfolioPhotos(userId, photos);

        return ResponseEntity.ok(response);
    }

    /**
     * Deletes a service offered by the provider.
     *
     * @param userId ID of the authenticated user
     * @param id     ID of the service to be deleted
     * @return HTTP 204 if deletion is successful
     */
    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(
            @RequestParam Long userId,
            @PathVariable Long id) {

        providerProfileService.deleteService(userId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Deletes a specific portfolio image by its URL.
     * Now uses LocalFileStorageService for consistent file deletion.
     *
     * @param userId   ID of the authenticated user
     * @param photoUrl URL of the portfolio image to delete
     * @return HTTP 204 if deletion is successful
     */
    @DeleteMapping("/portfolio")
    public ResponseEntity<Void> deletePortfolioPhoto(
            @RequestParam Long userId,
            @RequestParam String photoUrl) {

        providerProfileService.deletePortfolioPhoto(userId, photoUrl);
        return ResponseEntity.noContent().build();
    }
}
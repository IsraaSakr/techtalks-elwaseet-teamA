package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.user.ProviderProfileResponseDTO;
import com.elwaseet.backend.service.ProviderProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing public-facing endpoints for provider profiles.
 *
 * These endpoints are accessible without authentication and are intended
 * for consumers who want to view provider information.
 */
@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class PublicProviderController {

    /**
     * Service layer responsible for retrieving provider profile data.
     */
    private final ProviderProfileService providerProfileService;

    /**
     * Retrieves the public profile of a provider by its ID.
     *
     * @param id the unique identifier of the provider
     * @return public-facing provider profile data
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProviderProfileResponseDTO> getPublicProfile(
            @PathVariable Long id) {

        ProviderProfileResponseDTO response =
                providerProfileService.getPublicProfile(id);

        return ResponseEntity.ok(response);
    }
}

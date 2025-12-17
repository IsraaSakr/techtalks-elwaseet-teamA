package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.ProviderResponseDTO;
import com.elwaseet.backend.entity.Location;
import com.elwaseet.backend.service.ProviderProfileService;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;



@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderProfileService providerService;

@GetMapping
public Page<ProviderResponseDTO> browseProviders(
        @RequestParam(required = false) Long category,
        @RequestParam(required = false) Location location,
        @RequestParam(required = false) BigDecimal minRating,
        @RequestParam(required = false) Boolean verified,
        @PageableDefault(size = 10, sort = "averageRating", direction = Sort.Direction.DESC) @NonNull Pageable pageable
) {

        return providerService.browseProviders(category, location, minRating, verified, pageable);
    }
}
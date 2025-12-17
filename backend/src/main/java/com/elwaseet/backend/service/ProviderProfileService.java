package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.ProviderResponseDTO;
import com.elwaseet.backend.entity.Location;
import com.elwaseet.backend.entity.ProviderProfile;
import com.elwaseet.backend.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

@Service
@RequiredArgsConstructor
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;

    public Page<ProviderResponseDTO> browseProviders(
            Long category,
            Location location,
            BigDecimal minRating,
            Boolean verified,
            @NonNull Pageable pageable
    ) {
        Specification<ProviderProfile> spec = Specification.where(null);

        if (category != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.join("services").get("category").get("id"), category));
        }
        if (location != null) {
            spec = spec.and((root, query, cb) -> 
                    cb.equal(root.get("user").get("location"), location));
        }
        if (minRating != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("averageRating"), minRating));
        }
        if (verified != null && verified) {
            spec = spec.and((root, query, cb) -> cb.isTrue(root.get("isVerified")));
        }
        // Only providers with profiles (profileId not null)
        spec = spec.and((root, query, cb) -> cb.isNotNull(root.get("profileId")));

        return providerProfileRepository.findAll(spec, pageable)
                .map(ProviderResponseDTO::fromEntity);
    }
}
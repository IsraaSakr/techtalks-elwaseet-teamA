package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.service.AddServiceRequest;
import com.elwaseet.backend.dto.service.ServiceDTO;
import com.elwaseet.backend.entity.*;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.UnauthorizedException;
import com.elwaseet.backend.exception.ValidationException;
import com.elwaseet.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import com.elwaseet.backend.dto.user.PortfolioPhotoDTO;
import com.elwaseet.backend.dto.user.ProviderProfileResponseDTO;
import com.elwaseet.backend.dto.user.ProviderResponseDTO;
import com.elwaseet.backend.dto.user.UpdateProfileRequest;

import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;
import lombok.extern.slf4j.Slf4j;

/**
 * Service class responsible for managing provider profiles, services, and portfolio photos.
 *
 * <p>Responsibilities include:
 * <ul>
 *     <li>Updating provider profile information</li>
 *     <li>Adding and removing services</li>
 *     <li>Uploading and deleting portfolio images</li>
 *     <li>Retrieving public and private profile data</li>
 * </ul>
 *
 * <p>All write operations are transactional to ensure data consistency.
 * 
 * <p>REFACTORED: Now uses existing LocalFileStorageService instead of custom FileStorageServiceImpl
 * for consistency across the application.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final PortfolioPhotoRepository portfolioPhotoRepository;
    private final UserRepository userRepository;
    
    // REFACTORED: Use existing LocalFileStorageService instead of custom implementation
    private final FileStorageService fileStorageService;

    /** Maximum number of portfolio photos allowed per provider. */
    private static final int MAX_PORTFOLIO_PHOTOS = 10;

    /**
     * Updates the provider profile with optional fields from the request.
     * Creates a new profile if one does not exist for the provider.
     *
     * @param userId  ID of the provider user
     * @param request DTO containing profile fields to update
     * @return updated provider profile response DTO
     * @throws ResourceNotFoundException if user does not exist
     * @throws UnauthorizedException     if the user is not a provider
     */
    @Transactional
    public ProviderProfileResponseDTO updateProfile(@Nullable Long userId, UpdateProfileRequest request) {
        if (userId == null) {
            return null;
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.isProvider()) {
            throw new UnauthorizedException("Only providers can create/update profiles");
        }

        // Retrieve existing profile or create new one
        ProviderProfile profile = providerProfileRepository.findByUser_UserId(userId)
                .orElseGet(() -> providerProfileRepository.save(new ProviderProfile(user)));

        // Update only non-null fields from request
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getServiceAreas() != null) profile.setServiceAreas(request.getServiceAreas());
        if (request.getAvailabilityDescription() != null)
            profile.setAvailabilityDescription(request.getAvailabilityDescription());

        if (profile == null) {
            return null;
        }
        ProviderProfile savedProfile = providerProfileRepository.save(profile);
        return convertToResponseDTO(user, savedProfile);
    }

    /**
     * Adds a new service to a provider's profile.
     *
     * @param userId  ID of the provider
     * @param request DTO containing service details
     * @return DTO representing the newly added service
     */
    @Transactional
    public ServiceDTO addService(Long userId, AddServiceRequest request) {
        ProviderProfile profile = getProviderProfileByUserId(userId);

        ProviderService service = new ProviderService(profile, request.getServiceName(), request.getPrice());
        service.setDescription(request.getDescription());

        profile.getServices().add(service);
        providerProfileRepository.save(profile);

        return new ServiceDTO(service);
    }

    /**
     * Uploads one or more portfolio photos for a provider.
     * Uses the existing LocalFileStorageService for consistent file handling across the application.
     *
     * @param userId ID of the provider
     * @param photos list of photos to upload
     * @return updated provider profile response DTO
     * @throws ValidationException if file validation fails or photo limit exceeded
     */
    @Transactional
    public ProviderProfileResponseDTO uploadPortfolioPhotos(Long userId, List<MultipartFile> photos) {
        ProviderProfile profile = getProviderProfileByUserId(userId);

        // Check current photo count and validate limits
        int currentPhotoCount = portfolioPhotoRepository.countByProviderProfile_ProfileId(profile.getProfileId());
        int totalPhotosAfterUpload = currentPhotoCount + photos.size();

        if (totalPhotosAfterUpload > MAX_PORTFOLIO_PHOTOS) {
            throw new ValidationException(
                    String.format("Maximum %d portfolio photos allowed. You currently have %d and tried to upload %d more.",
                            MAX_PORTFOLIO_PHOTOS, currentPhotoCount, photos.size())
            );
        }

        if (photos == null || photos.isEmpty()) {
            throw new ValidationException("At least one photo is required");
        }

        // REFACTORED: Use LocalFileStorageService's validation method instead of custom validation
        fileStorageService.validateFiles(photos, photos.size());

        List<PortfolioPhoto> uploadedPhotos = new ArrayList<>();
        int uploadOrder = currentPhotoCount + 1;

        // REFACTORED: Use LocalFileStorageService for consistent file handling
        for (MultipartFile photo : photos) {
            if (photo == null || photo.isEmpty()) continue;

            // Use the existing service to save files to "portfolio" folder
            String photoUrl = fileStorageService.saveFile(photo, "portfolio");
            
            PortfolioPhoto portfolioPhoto = new PortfolioPhoto(profile, photoUrl);
            portfolioPhoto.setUploadOrder(uploadOrder++);
            uploadedPhotos.add(portfolioPhotoRepository.save(portfolioPhoto));
        }

        if (uploadedPhotos.isEmpty()) {
            throw new ValidationException("No valid photos were uploaded");
        }

        return convertToResponseDTO(profile.getUser(), profile);
    }

    /**
     * Deletes a service from a provider's profile.
     */
    @Transactional
    public void deleteService(Long userId, Long serviceId) {
        ProviderProfile profile = getProviderProfileByUserId(userId);
        
        ProviderService service = providerServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));
        
        // Verify ownership
        if (!service.getProviderProfile().getProfileId().equals(profile.getProfileId())) {
            throw new UnauthorizedException("Service does not belong to this provider");
        }
        
        // Delete service photos from file system if any
        if (service.getPhotos() != null && !service.getPhotos().isEmpty()) {
            for (ServicePhoto photo : service.getPhotos()) {
                try {
                    fileStorageService.deleteFile(photo.getPhotoUrl());
                    log.info("Deleted service photo file: {}", photo.getPhotoUrl());
                } catch (Exception e) {
                    log.warn("Failed to delete service photo file: {}", photo.getPhotoUrl(), e);
                    // Continue deleting other photos even if one fails
                }
            }
        }

        // Remove from categories (clears join table entries)
        service.getCategories().clear();
        
        // Delete the service (cascade should handle photos in database)
        providerServiceRepository.delete(service);
        
        log.info("Service deleted successfully. Service ID: {}, Provider ID: {}", serviceId, userId);
    }

    /**
     * Deletes a portfolio photo from a provider's profile and filesystem.
     */
    @Transactional
    public void deletePortfolioPhoto(Long userId, String photoUrl) {
        ProviderProfile profile = getProviderProfileByUserId(userId);

        PortfolioPhoto portfolioPhoto = portfolioPhotoRepository.findByPhotoUrl(photoUrl)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found: " + photoUrl));

        if (!portfolioPhoto.getProviderProfile().getProfileId().equals(profile.getProfileId())) {
            throw new UnauthorizedException("Photo does not belong to this provider");
        }

        fileStorageService.deleteFile(photoUrl);
        portfolioPhotoRepository.delete(portfolioPhoto);
        reorderPortfolioPhotos(profile);
    }

    /**
     * Retrieves the public profile of a provider by profile ID.
     *
     * @param profileId ID of the provider profile
     * @return provider profile response DTO
     */
    public ProviderProfileResponseDTO getPublicProfile(@Nullable Long profileId) {
        if (profileId == null) {
            return null;
        }
        ProviderProfile profile = providerProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found with id: " + profileId));

        return convertToResponseDTO(profile.getUser(), profile);
    }

    /* =======================
       Helper Methods
       ======================= */

    /**
     * Retrieves the provider profile for a given user ID.
     *
     * @param userId user ID
     * @return provider profile entity
     * @throws ResourceNotFoundException if user or profile not found
     * @throws UnauthorizedException     if user is not a provider
     */
    private ProviderProfile getProviderProfileByUserId(@Nullable Long userId) {
        if (userId == null) {
            return null;
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!user.isProvider()) {
            throw new UnauthorizedException("User is not a provider");
        }

        return providerProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for user id: " + userId));
    }

    /**
     * Reorders portfolio photos after deletion to maintain continuous upload order.
     *
     * @param profile provider profile entity
     */
    private void reorderPortfolioPhotos(ProviderProfile profile) {
        List<PortfolioPhoto> photos = portfolioPhotoRepository.findAllByProviderProfileOrderByUploadOrderAsc(profile);
        for (int i = 0; i < photos.size(); i++) {
            photos.get(i).setUploadOrder(i + 1);
        }
        portfolioPhotoRepository.saveAll(photos);
    }

    /**
     * Converts a provider profile entity to a response DTO including services and portfolio photos.
     *
     * @param user    provider user entity
     * @param profile provider profile entity
     * @return provider profile response DTO
     */
    private ProviderProfileResponseDTO convertToResponseDTO(User user, ProviderProfile profile) {
        ProviderProfileResponseDTO dto = new ProviderProfileResponseDTO(user, profile);

        List<ServiceDTO> serviceDTOs = profile.getServices().stream()
                .map(ServiceDTO::new)
                .toList();
        dto.setServices(serviceDTOs);

        List<PortfolioPhotoDTO> portfolioDTOs = profile.getPortfolioPhotos().stream()
                .map(PortfolioPhotoDTO::new)
                .toList();
        dto.setPortfolioPhotos(portfolioDTOs);

        return dto;
    }

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
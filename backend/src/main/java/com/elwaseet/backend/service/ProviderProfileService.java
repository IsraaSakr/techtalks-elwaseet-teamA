package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.*;
import com.elwaseet.backend.entity.*;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.UnauthorizedException;
import com.elwaseet.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
 */
@Service
@RequiredArgsConstructor
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final PortfolioPhotoRepository portfolioPhotoRepository;
    private final UserRepository userRepository;
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
    public ProviderProfileResponseDTO updateProfile(Long userId, UpdateProfileRequest request) {
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
     * Validates file types, enforces a maximum number of photos, and assigns upload order.
     *
     * @param userId ID of the provider
     * @param photos list of photos to upload
     * @return updated provider profile response DTO
     * @throws IOException if file storage fails
     */
    @Transactional
    public ProviderProfileResponseDTO uploadPortfolioPhotos(Long userId, List<MultipartFile> photos) throws IOException {
        ProviderProfile profile = getProviderProfileByUserId(userId);

        int currentPhotoCount = portfolioPhotoRepository.countByProviderProfile_ProfileId(profile.getProfileId());
        int totalPhotosAfterUpload = currentPhotoCount + photos.size();

        if (totalPhotosAfterUpload > MAX_PORTFOLIO_PHOTOS) {
            throw new IllegalArgumentException(
                    String.format("Maximum %d portfolio photos allowed. You currently have %d and tried to upload %d more.",
                            MAX_PORTFOLIO_PHOTOS, currentPhotoCount, photos.size())
            );
        }

        if (photos == null || photos.isEmpty()) {
            throw new IllegalArgumentException("At least one photo is required");
        }

        List<PortfolioPhoto> uploadedPhotos = new ArrayList<>();
        int uploadOrder = currentPhotoCount + 1;

        for (MultipartFile photo : photos) {
            if (photo == null || photo.isEmpty()) continue;

            String contentType = photo.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed. Invalid file: " + photo.getOriginalFilename());
            }

            String photoUrl = fileStorageService.saveFile(photo, "portfolio");
            PortfolioPhoto portfolioPhoto = new PortfolioPhoto(profile, photoUrl);
            portfolioPhoto.setUploadOrder(uploadOrder++);
            uploadedPhotos.add(portfolioPhotoRepository.save(portfolioPhoto));
        }

        if (uploadedPhotos.isEmpty()) {
            throw new IllegalArgumentException("No valid photos were uploaded");
        }

        return convertToResponseDTO(profile.getUser(), profile);
    }

    /**
     * Deletes a service from a provider's profile.
     *
     * @param userId    ID of the provider
     * @param serviceId ID of the service to delete
     * @throws ResourceNotFoundException if the service does not exist
     * @throws UnauthorizedException     if the service does not belong to the provider
     */
    @Transactional
    public void deleteService(Long userId, Long serviceId) {
        ProviderProfile profile = getProviderProfileByUserId(userId);

        ProviderService service = providerServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        if (!service.getProviderProfile().getProfileId().equals(profile.getProfileId())) {
            throw new UnauthorizedException("Service does not belong to this provider");
        }

        profile.getServices().remove(service);
        providerProfileRepository.save(profile);
    }

    /**
     * Deletes a portfolio photo from a provider's profile and filesystem.
     *
     * @param userId   ID of the provider
     * @param photoUrl URL of the photo to delete
     * @throws IOException if file deletion fails
     */
    @Transactional
    public void deletePortfolioPhoto(Long userId, String photoUrl) throws IOException {
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
    public ProviderProfileResponseDTO getPublicProfile(Long profileId) {
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
    private ProviderProfile getProviderProfileByUserId(Long userId) {
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
}

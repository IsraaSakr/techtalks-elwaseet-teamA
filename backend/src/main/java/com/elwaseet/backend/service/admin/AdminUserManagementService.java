package com.elwaseet.backend.service.admin;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.elwaseet.backend.dto.admin.UserAdminDTO;
import com.elwaseet.backend.entity.ProviderProfile;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.repository.ProviderProfileRepository;
import com.elwaseet.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserManagementService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    // private final EmailService emailService; // enable when email system is ready

    // =========================================================================
    // GET USERS (WITH FILTERS)
    // =========================================================================

    /**
     * Retrieve paginated users with optional filters.
     *
     * Filters are optional and can be combined.
     */
    @Transactional(readOnly = true)
    public Page<UserAdminDTO> getAllUsers(
            User.AccountType accountType,
            Boolean isVerified,
            Boolean isBanned,
            Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);

        List<UserAdminDTO> filteredUsers = usersPage.getContent()
                .stream()
                .filter(user -> accountType == null || user.getAccountType() == accountType)
                .filter(user -> {
                    // isVerified filter only applies to providers
                    if (isVerified == null) {
                        return true; // No filter
                    }
                    // For providers, check their profile verification status
                    if (user.getAccountType() == User.AccountType.HYBRID_PROVIDER) {
                        ProviderProfile profile = user.getProviderProfile();
                        if (profile == null) {
                            return !isVerified; // No profile = not verified
                        }
                        return Boolean.TRUE.equals(profile.getIsVerified()) == isVerified;
                    }
                    return false; // Customers can't be verified
                })
                .filter(user -> isBanned == null
                        || Boolean.TRUE.equals(user.getIsBanned()) == isBanned)
                .map(this::mapToAdminDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(
                filteredUsers,
                pageable,
                usersPage.getTotalElements());
    }

    // =========================================================================
    // VERIFY PROVIDER
    // =========================================================================

    /**
     * Verify a provider account.
     */
    @Transactional
    public UserAdminDTO verifyProvider(Long userId) {

        User user = getUserOrThrow(userId);

        // Check if user is a provider
        if (user.getAccountType() != User.AccountType.HYBRID_PROVIDER) {
            throw new IllegalStateException("Only providers can be verified");
        }

        // Get provider profile
        ProviderProfile profile = user.getProviderProfile();
        if (profile == null) {
            throw new IllegalStateException("Provider profile not found");
        }

        // Check if already verified
        if (Boolean.TRUE.equals(profile.getIsVerified())) {
            throw new IllegalStateException("Provider is already verified");
        }

        // Verify the provider profile (NOT the email!)
        profile.setIsVerified(true);
        profile.setVerificationStatus(ProviderProfile.VerificationStatus.APPROVED);
        
        // No need to save - cascade from user or save profile directly
        providerProfileRepository.save(profile);

        // emailService.sendProviderVerifiedEmail(user.getEmail());

        return mapToAdminDTO(user);
    }

    // =========================================================================
    // BAN USER
    // =========================================================================

    /**
     * Ban (suspend) a user account.
     */
    @Transactional
    public UserAdminDTO banUser(Long userId, String reason) {

        User user = getUserOrThrow(userId);

        // Validate user is not already banned
        if (Boolean.TRUE.equals(user.getIsBanned())) {
            throw new IllegalStateException("User is already banned");
        }

        user.setIsBanned(true);
        userRepository.save(user);

        // emailService.sendUserBannedEmail(user.getEmail(), reason);

        return mapToAdminDTO(user);
    }

    // =========================================================================
    // UNBAN USER
    // =========================================================================

    /**
     * Unban a previously banned user.
     */
    @Transactional
    public UserAdminDTO unbanUser(Long userId) {

        User user = getUserOrThrow(userId);

        // Validate user is actually banned
        if (!Boolean.TRUE.equals(user.getIsBanned())) {
            throw new IllegalStateException("User is not banned");
        }

        user.setIsBanned(false);
        userRepository.save(user);

        // emailService.sendUserUnbannedEmail(user.getEmail());

        return mapToAdminDTO(user);
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private UserAdminDTO mapToAdminDTO(User user) {
    
    // For providers, show their profile verification status
    // For customers, show false (they can't be admin-verified)
    Boolean isVerified = false;
    if (user.getAccountType() == User.AccountType.HYBRID_PROVIDER) {
        ProviderProfile profile = user.getProviderProfile();
        if (profile != null) {
            isVerified = profile.getIsVerified();
        }
    }

    return new UserAdminDTO(
            user.getUserId(),
            user.getEmail(),
            user.getName(),
            user.getAccountType(),
            isVerified, // shows admin verification for providers
            user.getIsBanned(),
            user.getCreatedAt());
}
}

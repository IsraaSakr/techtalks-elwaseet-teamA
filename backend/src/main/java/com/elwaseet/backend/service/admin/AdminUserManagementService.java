package com.elwaseet.backend.service.admin;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.elwaseet.backend.dto.admin.UserAdminDTO;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserManagementService {

    private final UserRepository userRepository;
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
                .filter(user -> isVerified == null
                        || Boolean.TRUE.equals(user.getIsEmailVerified()) == isVerified)
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

        if (user.getAccountType() != User.AccountType.HYBRID_PROVIDER) {
            throw new IllegalStateException("Only providers can be verified");
        }

        user.setIsEmailVerified(true);
        userRepository.save(user);

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

        return new UserAdminDTO(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getAccountType(),
                user.getIsEmailVerified(),
                user.getIsBanned(),
                user.getCreatedAt());
    }
}

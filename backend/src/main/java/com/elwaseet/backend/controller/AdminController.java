package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.admin.PlatformStatsDTO;
import com.elwaseet.backend.dto.admin.UserAdminDTO;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.service.admin.AdminStatsService;
import com.elwaseet.backend.service.admin.AdminUserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // enable when security is wired
@RequiredArgsConstructor
public class AdminController {

    private final AdminStatsService adminStatsService;
    private final AdminUserManagementService userManagementService;

    // =========================================================================
    // PLATFORM STATS
    // =========================================================================

    /**
     * Get platform statistics dashboard
     *
     * GET /api/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDTO> getStats() {
        return ResponseEntity.ok(adminStatsService.getPlatformStats());
    }

    // =========================================================================
    // USER MANAGEMENT
    // =========================================================================

    /**
     * Get all users with optional filters
     *
     * GET /api/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserAdminDTO>> getUsers(
            @RequestParam(required = false) User.AccountType accountType,
            @RequestParam(required = false) Boolean isVerified,
            @RequestParam(required = false) Boolean isBanned,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<UserAdminDTO> users = userManagementService.getAllUsers(
                accountType,
                isVerified,
                isBanned,
                pageable);

        return ResponseEntity.ok(users);
    }

    // =========================================================================
    // VERIFY PROVIDER
    // =========================================================================

    /**
     * Verify a provider account
     *
     * PUT /api/admin/users/{id}/verify
     */
    @PutMapping("/users/{id}/verify")
    public ResponseEntity<UserAdminDTO> verifyProvider(@PathVariable Long id) {
        return ResponseEntity.ok(userManagementService.verifyProvider(id));
    }

    // =========================================================================
    // BAN USER
    // =========================================================================

    /**
     * Ban (suspend) a user
     *
     * PUT /api/admin/users/{id}/ban
     */
    @PutMapping("/users/{id}/ban")
    public ResponseEntity<UserAdminDTO> banUser(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.getOrDefault("reason", "Policy violation") : "Policy violation";
        return ResponseEntity.ok(userManagementService.banUser(id, reason));
    }

    // =========================================================================
    // UNBAN USER
    // =========================================================================

    /**
     * Unban a user
     *
     * PUT /api/admin/users/{id}/unban
     */
    @PutMapping("/users/{id}/unban")
    public ResponseEntity<UserAdminDTO> unbanUser(@PathVariable Long id) {
        return ResponseEntity.ok(userManagementService.unbanUser(id));
    }
}

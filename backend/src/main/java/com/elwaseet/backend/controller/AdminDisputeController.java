package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.dispute.DisputeDTO;
import com.elwaseet.backend.dto.dispute.DisputeListDTO;
import com.elwaseet.backend.dto.dispute.ResolveDisputeRequest;
import com.elwaseet.backend.entity.AdminUser;
import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.service.DisputeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Admin-only endpoints for managing disputes
 * Admin can:
 * - List all disputes (paginated, filterable by status)
 * - View dispute details
 * - Resolve disputes
 */
@RestController
@RequestMapping("/api/admin/disputes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDisputeController {

    private final DisputeService disputeService;

    /**
     * List all disputes (paginated)
     * GET /api/admin/disputes?status=OPEN&page=0&size=10
     * 
     * @param status Optional filter by status (OPEN, UNDER_REVIEW, RESOLVED, APPEALED)
     * @param page Page number (default 0)
     * @param size Page size (default 10)
     * @return Paginated list of disputes
     */
    @GetMapping
    public ResponseEntity<Page<DisputeListDTO>> listDisputes(
            @RequestParam(required = false) Dispute.DisputeStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "openedAt"));
        Page<Dispute> disputes = disputeService.listDisputes(status, pageable);
        Page<DisputeListDTO> dtoPage = disputes.map(DisputeListDTO::new);
        return ResponseEntity.ok(dtoPage);
    }

    /**
     * Get dispute details by ID
     * GET /api/admin/disputes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Dispute> getDispute(@PathVariable Long id) {
        Dispute dispute = disputeService.getDisputeById(id);
        return ResponseEntity.ok(dispute);
    }

    /**
     * Resolve a dispute
     * POST /api/admin/disputes/{id}/resolve
     * 
     * Request body:
     * {
     *   "resolution": "PROVIDER_FULL" | "CUSTOMER_FULL" | "SPLIT" | "FIX_REQUIRED",
     *   "resolutionNotes": "Admin's decision notes",
     *   "providerSplitPercentage": 60.00,  // Only for SPLIT
     *   "customerSplitPercentage": 40.00   // Only for SPLIT
     * }
     */
    @PostMapping("/{id}/resolve")
    public ResponseEntity<DisputeDTO> resolveDispute(
            @PathVariable Long id,
            @Valid @RequestBody ResolveDisputeRequest request,
            @AuthenticationPrincipal AdminUser admin) {

        Dispute resolvedDispute = disputeService.resolveDispute(id, request, admin);
        DisputeDTO dto = disputeService.toDTO(resolvedDispute);
        return ResponseEntity.ok(dto);
}
}

package com.elwaseet.backend.controller;


import com.elwaseet.backend.dto.dispute.DisputeCreateRequest;
import com.elwaseet.backend.dto.dispute.DisputeDTO;
import com.elwaseet.backend.service.DisputeService;
import com.elwaseet.backend.repository.DisputeRepository;
import com.elwaseet.backend.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    private final DisputeService disputeService;
    private final DisputeRepository disputeRepository;

    public DisputeController(DisputeService disputeService, DisputeRepository disputeRepository) {
        this.disputeService = disputeService;
        this.disputeRepository = disputeRepository;
    }

    /**
     * Open a new dispute.
     * Only authenticated customers can open disputes.
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<DisputeDTO> openDispute(
            @ModelAttribute DisputeCreateRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        // enforce ownership: customerId in request must match authenticated user
        if (!request.getCustomerId().equals(authenticatedUser.getUserId())) {
            return ResponseEntity.status(403).build();
        }

        DisputeDTO dispute = disputeService.openDispute(
                request.getTransactionId(),
                authenticatedUser,
                request.getReasonCategory(),
                request.getDescription(),
                request.getEvidenceFiles()
        );

        return ResponseEntity.ok(dispute);
    }

    /**
     * Get all disputes opened by the authenticated customer.
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-disputes")
    public List<DisputeDTO> myDisputes(@AuthenticationPrincipal User authenticatedUser) {
        return disputeRepository.findByOpenedBy(authenticatedUser)
                .stream()
                .map(disputeService::toDTO)
                .toList();
    }

    /**
     * Get a specific dispute by ID.
     * Only the owner (openedBy) can view it.
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/{id}")
    public ResponseEntity<DisputeDTO> getDispute(
            @PathVariable Long id,
            @AuthenticationPrincipal User authenticatedUser) {

        return disputeRepository.findById(id)
                .filter(d -> d.getOpenedBy().getUserId().equals(authenticatedUser.getUserId()))
                .map(disputeService::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }
}
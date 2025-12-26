package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.transaction.TransactionRequestDTO;
import com.elwaseet.backend.dto.transaction.TransactionResponseDTO;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.UnauthorizedException;
import com.elwaseet.backend.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/commit")
    public TransactionResponseDTO commit(@RequestBody TransactionRequestDTO request) {
        Transaction tx = transactionService.commit(
                request.getJobId(),
                request.getCustomerId(),
                request.getProviderId(),
                request.getAmount()
        );
        return toResponse(tx);
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public TransactionResponseDTO startWork(@PathVariable Long id,  @AuthenticationPrincipal User user) {
        Long providerId = user.getUserId();
        Transaction tx = transactionService.startWork(id, providerId);
        return toResponse(tx);
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('HYBRID_PROVIDER')")
    public TransactionResponseDTO completeWork(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Long providerId = user.getUserId();
        Transaction tx = transactionService.completeWork(id, providerId);
        return toResponse(tx);
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('CUSTOMER')")
    public TransactionResponseDTO confirmWork(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Long customerId = user.getUserId();
        Transaction tx = transactionService.confirmWork(id, customerId);
        return toResponse(tx);
    }

    @PostMapping("/{id}/dispute")
    @PreAuthorize("hasRole('CUSTOMER')")
    public TransactionResponseDTO openDispute(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Long customerId = user.getUserId();
        Transaction tx = transactionService.openDispute(id, customerId);
        return toResponse(tx);
    }

    // --- Mapper ---
    private TransactionResponseDTO toResponse(Transaction tx) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setTransactionId(tx.getTransactionId());
        dto.setStatus(tx.getStatus().name());
        dto.setAmount(tx.getAmount());
        dto.setCommittedAt(tx.getCommittedAt());
        dto.setInProgressAt(tx.getInProgressAt());
        dto.setCompletedAt(tx.getCompletedAt());
        dto.setConfirmedAt(tx.getConfirmedAt());
        dto.setDisputedAt(tx.getDisputedAt());
        dto.setResolvedAt(tx.getResolvedAt());
        return dto;
    }

        /**
     * Get transaction details (both customer and provider can view)
     * GET /api/transactions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'HYBRID_PROVIDER')")
    public ResponseEntity<TransactionResponseDTO> getTransactionDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        
        Transaction transaction = transactionService.getTransactionById(id);
        
        // SECURITY: Verify user is either customer or provider of this transaction
        boolean isCustomer = transaction.getCustomer().getUserId().equals(user.getUserId());
        boolean isProvider = transaction.getProvider().getUserId().equals(user.getUserId());
        
        if (!isCustomer && !isProvider) {
            throw new UnauthorizedException("You can only view your own transactions");
        }
        
        return ResponseEntity.ok(toResponse(transaction));
    }

    /**
     * Get my transaction history (paginated)
     * GET /api/transactions/my-history?page=0&size=10
     */
    @GetMapping("/my-history")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'HYBRID_PROVIDER')")
    public ResponseEntity<Page<TransactionResponseDTO>> getMyTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User user) {
        
        Long userId = user.getUserId();
        
        Page<Transaction> transactions = transactionService.getUserTransactions(userId, page, size);
        
        // Convert Page<Transaction> to Page<TransactionResponseDTO>
        Page<TransactionResponseDTO> response = transactions.map(this::toResponse);
        
        return ResponseEntity.ok(response);
    }
}
package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.transaction.TransactionRequestDTO;
import com.elwaseet.backend.dto.transaction.TransactionResponseDTO;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.service.TransactionService;
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
    public TransactionResponseDTO startWork(@PathVariable Long id, @RequestParam Long providerId) {
        Transaction tx = transactionService.startWork(id, providerId);
        return toResponse(tx);
    }

    @PostMapping("/{id}/complete")
    public TransactionResponseDTO completeWork(@PathVariable Long id, @RequestParam Long providerId) {
        Transaction tx = transactionService.completeWork(id, providerId);
        return toResponse(tx);
    }

    @PostMapping("/{id}/confirm")
    public TransactionResponseDTO confirmWork(@PathVariable Long id, @RequestParam Long customerId) {
        Transaction tx = transactionService.confirmWork(id, customerId);
        return toResponse(tx);
    }

    @PostMapping("/{id}/release")
    public TransactionResponseDTO releasePayment(@PathVariable Long id) {
        Transaction tx = transactionService.releasePayment(id);
        return toResponse(tx);
    }

    @PostMapping("/{id}/dispute")
    public TransactionResponseDTO openDispute(@PathVariable Long id, @RequestParam Long customerId) {
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
}
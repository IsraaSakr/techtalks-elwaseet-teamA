package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.dispute.AppealDisputeRequest;
import com.elwaseet.backend.dto.dispute.DisputeDTO;
import com.elwaseet.backend.dto.dispute.DisputeEvidencePhotoDTO;
import com.elwaseet.backend.dto.dispute.ResolveDisputeRequest;
import com.elwaseet.backend.entity.AdminUser;
import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.Dispute.DisputeResolution;
import com.elwaseet.backend.entity.Dispute.DisputeStatus;
import com.elwaseet.backend.entity.DisputeAppeal;
import com.elwaseet.backend.entity.DisputeEvidencePhoto;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.Job.JobStatus;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.Transaction.TransactionStatus;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.exception.ConflictException;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.repository.DisputeRepository;
import com.elwaseet.backend.repository.JobRepository;
import com.elwaseet.backend.repository.DisputeAppealRepository;
import com.elwaseet.backend.repository.DisputeEvidencePhotoRepository;
import com.elwaseet.backend.repository.TransactionRepository;
import com.elwaseet.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.elwaseet.backend.exception.ValidationException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final DisputeEvidencePhotoRepository evidenceRepository;
    private final TransactionRepository transactionRepository;
    private final FileStorageService fileStorageService;
    private final DisputeAppealRepository appealRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final EmailService emailService;
    public DisputeDTO openDispute(Long transactionId,
                                  User customer,
                                  Dispute.DisputeReason reasonCategory,
                                  String description,
                                  List<MultipartFile> evidenceFiles) {

        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));

        // Rule 1: Only one dispute per transaction
        if (disputeRepository.existsByTransaction(tx)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Transaction already has a dispute");
        }

        // Rule 2: Only COMPLETED transactions
        if (!tx.getStatus().equals(Transaction.TransactionStatus.COMPLETED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only completed transactions can be disputed");
        }

        // Rule 3: Must open within 7 days of completion
        if (tx.getCompletedAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dispute deadline expired");
        }

        // Rule 4: Max 5 evidence photos
        if (evidenceFiles != null && evidenceFiles.size() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max 5 evidence photos allowed");
        }

        Job job = tx.getJob();

        // Create dispute
        Dispute dispute = new Dispute(tx, job, customer, reasonCategory, description);
        dispute.setStatus(Dispute.DisputeStatus.OPEN);
        dispute.setOpenedAt(LocalDateTime.now());

        dispute = disputeRepository.save(dispute);

        // Save evidence photos
        if (evidenceFiles != null && !evidenceFiles.isEmpty()) {
            List<String> photoUrls = fileStorageService.saveMultipleFiles(evidenceFiles, "disputes", 5);
            
            for (String url : photoUrls) {
                DisputeEvidencePhoto photo = new DisputeEvidencePhoto(dispute, customer, url);
                evidenceRepository.save(photo);
                dispute.getEvidencePhotos().add(photo);
            }
        }

        // Update transaction
        tx.setStatus(Transaction.TransactionStatus.DISPUTED);
        transactionRepository.save(tx);

        return toDTO(dispute);
    }

    public DisputeDTO toDTO(Dispute dispute) {
        DisputeDTO dto = new DisputeDTO();
        dto.setDisputeId(dispute.getDisputeId());
        dto.setTransactionId(dispute.getTransaction().getTransactionId());
        dto.setStatus(dispute.getStatus().name());
        dto.setOpenedAt(dispute.getOpenedAt());
        dto.setResolvedAt(dispute.getResolvedAt());

        List<DisputeEvidencePhotoDTO> photos = dispute.getEvidencePhotos().stream()
                .map(photo -> {
                    DisputeEvidencePhotoDTO pDto = new DisputeEvidencePhotoDTO();
                    pDto.setPhotoId(photo.getPhotoId());
                    pDto.setPhotoUrl(photo.getPhotoUrl());
                    pDto.setUploadedAt(photo.getUploadedAt());
                    return pDto;
                }).toList();

        dto.setEvidencePhotos(photos);
        return dto;
    }

    /**
     * List disputes with optional status filter (Admin only)
     * 
     * @param status Optional filter by status
     * @param pageable Pagination info
     * @return Paginated disputes
     */
    public Page<Dispute> listDisputes(DisputeStatus status, Pageable pageable) {
        if (status == null) {
            return disputeRepository.findAll(pageable);
        }
        return disputeRepository.findByStatus(status, pageable);
    }

    /**
     * Get dispute by ID
     * 
     * @param disputeId Dispute ID
     * @return Dispute entity
     * @throws ResourceNotFoundException if dispute not found
     */
    public Dispute getDisputeById(Long disputeId) {
        return disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with ID: " + disputeId));
    }

    /**
     * Resolve a dispute (Admin only)
     * 
     * Business Logic:
     * 1. Validate dispute can be resolved (OPEN or UNDER_REVIEW)
     * 2. Apply resolution based on type
     * 3. Distribute money (except FIX_REQUIRED)
     * 4. Update transaction and job statuses
     * 5. Send email notifications to both parties
     * 6. Set appeal deadline (3 days from now)
     * 
     * @param disputeId Dispute ID
     * @param request Resolution details
     * @param resolvedBy Admin who resolved it
     * @return Resolved dispute
     */
    @Transactional
    public Dispute resolveDispute(Long disputeId, ResolveDisputeRequest request, AdminUser resolvedBy) {
        
        // 1. Get and validate dispute
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with ID: " + disputeId));

        // 2. Validate dispute status - can only resolve OPEN or UNDER_REVIEW disputes
        if (dispute.getStatus() != DisputeStatus.OPEN && dispute.getStatus() != DisputeStatus.UNDER_REVIEW) {
            throw new ConflictException(
                "Cannot resolve dispute. Dispute must be OPEN or UNDER_REVIEW but is " + dispute.getStatus()
            );
        }

        // 3. Get related entities
        Transaction transaction = dispute.getTransaction();
        Job job = transaction.getJob();
        User provider = transaction.getProvider();
        User customer = transaction.getCustomer();
        BigDecimal totalAmount = transaction.getAmount();

        log.info("Resolving dispute {} with resolution {}", disputeId, request.getResolution());

        // 4. Update dispute record
        dispute.setResolution(request.getResolution());
        dispute.setResolutionNotes(request.getResolutionNotes());
        dispute.setResolvedBy(resolvedBy);
        dispute.setResolvedAt(LocalDateTime.now());
        dispute.setAppealDeadline(LocalDateTime.now().plusDays(3));

        // 5. Handle FIX_REQUIRED separately (no money moves, job goes back to IN_PROGRESS)
        if (request.getResolution() == DisputeResolution.FIX_REQUIRED) {
            return handleFixRequired(dispute, transaction, job, provider, customer);
        }

        // 6. For all other resolutions, calculate money distribution
        BigDecimal providerAmount = BigDecimal.ZERO;
        BigDecimal customerAmount = BigDecimal.ZERO;

        switch (request.getResolution()) {
            case PROVIDER_FULL:
                providerAmount = totalAmount;
                log.info("PROVIDER_FULL: Provider gets ${}", providerAmount);
                break;

            case CUSTOMER_FULL:
                customerAmount = totalAmount;
                log.info("CUSTOMER_FULL: Customer gets ${}", customerAmount);
                break;

            case SPLIT:
                // Validate split percentages
                validateSplitPercentages(request);
                
                // Store split percentages in dispute
                dispute.setSplitPercentageProvider(request.getProviderSplitPercentage());
                dispute.setSplitPercentageCustomer(request.getCustomerSplitPercentage());

                // Calculate amounts
                providerAmount = totalAmount
                    .multiply(request.getProviderSplitPercentage())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                customerAmount = totalAmount.subtract(providerAmount);

                log.info("SPLIT: Provider gets ${} ({}%), Customer gets ${} ({}%)",
                    providerAmount, request.getProviderSplitPercentage(),
                    customerAmount, request.getCustomerSplitPercentage());
                break;

            default:
                throw new ValidationException("Invalid resolution type: " + request.getResolution());
        }

        // 7. Record balances BEFORE distribution
        transaction.setProviderBalanceBefore(provider.getSimulatedBalance());
        transaction.setCustomerBalanceBefore(customer.getSimulatedBalance());

        // 8. Distribute money
        if (providerAmount.compareTo(BigDecimal.ZERO) > 0) {
            provider.addToBalance(providerAmount);
            log.info("Added ${} to provider {} balance", providerAmount, provider.getEmail());
        }
        if (customerAmount.compareTo(BigDecimal.ZERO) > 0) {
            customer.addToBalance(customerAmount);
            log.info("Added ${} to customer {} balance", customerAmount, customer.getEmail());
        }

        // 9. Record balances AFTER distribution
        transaction.setProviderBalanceAfter(provider.getSimulatedBalance());
        transaction.setCustomerBalanceAfter(customer.getSimulatedBalance());

        // Save users with new balances
        userRepository.save(provider);
        userRepository.save(customer);

        // 10. Update transaction status
        transaction.setStatus(TransactionStatus.RESOLVED);
        transaction.setResolvedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        // 11. Update job status based on resolution
        updateJobStatusForResolution(job, request.getResolution());
        jobRepository.save(job);

        // 12. Mark dispute as RESOLVED
        dispute.setStatus(DisputeStatus.RESOLVED);
        Dispute savedDispute = disputeRepository.save(dispute);

        // 13. Send email notifications (async)
        sendResolutionNotifications(dispute, provider, customer, providerAmount, customerAmount);

        log.info("Dispute {} resolved successfully by admin {}", disputeId, resolvedBy.getEmail());
        return savedDispute;
    }

    /**
     * Handle FIX_REQUIRED resolution
     * Money stays in escrow, job goes back to IN_PROGRESS
     */
    private Dispute handleFixRequired(Dispute dispute, Transaction transaction, 
                                      Job job, User provider, User customer) {
        
        log.info("FIX_REQUIRED: Money stays in escrow, job returns to IN_PROGRESS");

        // Money stays frozen, no balance changes
        transaction.setStatus(TransactionStatus.DISPUTED); // Keep as DISPUTED
        transactionRepository.save(transaction);

        // Job goes back to IN_PROGRESS so provider can fix the work
        job.setStatus(JobStatus.IN_PROGRESS);
        jobRepository.save(job);
        // Dispute is technically "resolved" from admin's perspective
        dispute.setStatus(DisputeStatus.RESOLVED);
        Dispute savedDispute = disputeRepository.save(dispute);

        // Notify both parties
        emailService.sendDisputeFixRequiredEmail(
            provider.getEmail(),
            provider.getName(),
            customer.getEmail(),
            customer.getName(),
            job.getTitle(),
            dispute.getResolutionNotes()
        );

        return savedDispute;
    }

    /**
     * Validate split percentages for SPLIT resolution
     */
    private void validateSplitPercentages(ResolveDisputeRequest request) {
        BigDecimal provSplit = request.getProviderSplitPercentage();
        BigDecimal custSplit = request.getCustomerSplitPercentage();

        if (provSplit == null || custSplit == null) {
            throw new ValidationException(
                "Both providerSplitPercentage and customerSplitPercentage are required for SPLIT resolution"
            );
        }

        // Check for negative values
        if (provSplit.compareTo(BigDecimal.ZERO) < 0 || custSplit.compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Split percentages cannot be negative");
        }

        // Check sum equals 100
        BigDecimal sum = provSplit.add(custSplit);
        if (sum.compareTo(new BigDecimal("100")) != 0) {
            throw new ValidationException(
                String.format("Split percentages must sum to exactly 100%%. Got: Provider %.2f%% + Customer %.2f%% = %.2f%%",
                    provSplit, custSplit, sum)
            );
        }
    }

    /**
     * Update job status based on resolution type
     */
    private void updateJobStatusForResolution(Job job, DisputeResolution resolution) {
        switch (resolution) {
            case PROVIDER_FULL:
            case SPLIT:
                // Provider got some/all money → job is complete
                job.setStatus(JobStatus.COMPLETED);
                break;
            case CUSTOMER_FULL:
                // Full refund → job essentially cancelled/failed
                job.setStatus(JobStatus.CANCELLED);
                break;
            case FIX_REQUIRED:
                // Already handled in handleFixRequired()
                break;
        }
        jobRepository.save(job);
    }

    /**
     * Send email notifications about resolution
     */
    private void sendResolutionNotifications(Dispute dispute, User provider, User customer,
                                            BigDecimal providerAmount, BigDecimal customerAmount) {
        try {
            emailService.sendDisputeResolvedEmail(
                provider.getEmail(),
                provider.getName(),
                customer.getEmail(),
                customer.getName(),
                dispute.getJob().getTitle(),
                dispute.getResolution(),
                providerAmount,
                customerAmount,
                dispute.getResolutionNotes()
            );
        } catch (Exception e) {
            // Don't fail the transaction if email fails
            log.error("Failed to send dispute resolution emails: {}", e.getMessage());
        }
    }

    /**
     * Appeal a dispute resolution (User only)
     * 
     * Business Logic:
     * 1. Validate dispute is RESOLVED
     * 2. Check within 3-day appeal window
     * 3. Verify user is involved in the dispute (customer or provider)
     * 4. Ensure no existing appeal
     * 5. Create appeal and update dispute status to APPEALED
     * 
     * @param disputeId Dispute ID
     * @param request Appeal request
     * @param appealedBy User appealing
     * @return Created appeal
     */
    @Transactional
    public DisputeAppeal appealDispute(Long disputeId, AppealDisputeRequest request, User appealedBy) {
        
        // 1. Get dispute
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with ID: " + disputeId));

        // 2. Validate dispute is RESOLVED
        if (dispute.getStatus() != DisputeStatus.RESOLVED) {
            throw new ConflictException(
                "Only RESOLVED disputes can be appealed. Current status: " + dispute.getStatus()
            );
        }

        // 3. Check appeal deadline (3 days from resolution)
        if (LocalDateTime.now().isAfter(dispute.getAppealDeadline())) {
            throw new ValidationException(
                String.format("Appeal deadline has passed. Deadline was: %s, Current time: %s",
                    dispute.getAppealDeadline(), LocalDateTime.now())
            );
        }

        // 4. Verify user is part of dispute (customer or provider)
        User customer = dispute.getTransaction().getCustomer();
        User provider = dispute.getTransaction().getProvider();
        
        if (!appealedBy.getUserId().equals(customer.getUserId()) && 
            !appealedBy.getUserId().equals(provider.getUserId())) {
            throw new ValidationException(
                "You are not authorized to appeal this dispute. Only the customer or provider involved can appeal."
            );
        }

        // 5. Check if already appealed
        if (dispute.getAppeal() != null) {
            throw new ConflictException(
                "This dispute has already been appealed. Only one appeal is allowed per dispute."
            );
        }

        // 6. Create appeal
        DisputeAppeal appeal = new DisputeAppeal(dispute, appealedBy, request.getAppealReason());
        appeal = appealRepository.save(appeal);

        // 7. Update dispute status to APPEALED
        dispute.setAppeal(appeal);
        dispute.setStatus(DisputeStatus.APPEALED);
        disputeRepository.save(dispute);

        log.info("Dispute {} appealed by user {}", disputeId, appealedBy.getEmail());

        // 8. Notify admin about new appeal (async)
        try {
            emailService.sendNewAppealNotificationToAdmin(dispute, appealedBy, request.getAppealReason());
        } catch (Exception e) {
            log.error("Failed to send appeal notification: {}", e.getMessage());
        }

        return appeal;
    }
}
package com.elwaseet.backend.service.admin;

import com.elwaseet.backend.dto.admin.PlatformStatsDTO;
import com.elwaseet.backend.entity.*;

import com.elwaseet.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.Job.JobStatus;
import com.elwaseet.backend.entity.User.AccountType;

/**
 * ============================================================================
 * ADMIN STATS SERVICE
 * ============================================================================
 * Provides platform-wide statistics for admin dashboard.
 */
@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final TransactionRepository transactionRepository;
    private final DisputeRepository disputeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    /**
     * =========================================================================
     * GET PLATFORM STATISTICS
     * =========================================================================
     */
    @Transactional(readOnly = true)
    public PlatformStatsDTO getPlatformStats() {

        // ---------------------------------------------------------------------
        // USER STATS
        // ---------------------------------------------------------------------
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByAccountType(AccountType.CUSTOMER);
        long totalProviders = userRepository.countByAccountType(AccountType.HYBRID_PROVIDER);
        long verifiedProviders = userRepository
                .countByAccountTypeAndIsEmailVerifiedTrue(AccountType.HYBRID_PROVIDER);

        // ---------------------------------------------------------------------
        // JOB STATS
        // ---------------------------------------------------------------------
        long totalJobs = jobRepository.count();

        long activeJobs = jobRepository.countByStatus(JobStatus.OPEN)
                + jobRepository.countByStatus(JobStatus.IN_PROGRESS);

        long completedJobs = jobRepository.countByStatus(JobStatus.COMPLETED);

        // ---------------------------------------------------------------------
        // TRANSACTION STATS
        // ---------------------------------------------------------------------
        long totalTransactions = transactionRepository.count();

        BigDecimal totalRevenue = transactionRepository
                .sumCompletedTransactionAmounts()
                .orElse(BigDecimal.ZERO);

        BigDecimal platformEarnings = totalRevenue.multiply(BigDecimal.valueOf(0.10));

        // ---------------------------------------------------------------------
        // DISPUTE STATS (FIXED ENUM)
        // ---------------------------------------------------------------------
        long pendingDisputes = disputeRepository.countByStatus(
                Dispute.DisputeStatus.OPEN);

        long resolvedDisputes = disputeRepository.countByStatus(
                Dispute.DisputeStatus.RESOLVED);

        // ---------------------------------------------------------------------
        // JOBS BY CATEGORY
        // ---------------------------------------------------------------------
        Map<String, Long> jobsByCategory = new HashMap<>();
        serviceCategoryRepository.findAll().forEach(category -> {
            long count = jobRepository.countByCategories_CategoryId(
                    category.getCategoryId());
            jobsByCategory.put(category.getCategoryName(), count);
        });

        // ---------------------------------------------------------------------
        // DTO CONSTRUCTOR (ORDER FIXED)
        // ---------------------------------------------------------------------
        return new PlatformStatsDTO(
                totalUsers,
                totalCustomers,
                totalProviders,
                verifiedProviders,
                totalJobs,
                activeJobs,
                completedJobs,
                totalTransactions,
                totalRevenue,
                platformEarnings,
                pendingDisputes,
                resolvedDisputes,
                jobsByCategory);
    }

}

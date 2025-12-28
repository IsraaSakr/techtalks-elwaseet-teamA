package com.elwaseet.backend.service.impl;

import com.elwaseet.backend.dto.common.PlatformStatsResponse;
import com.elwaseet.backend.repository.*;
import com.elwaseet.backend.entity.Dispute.DisputeStatus;
import com.elwaseet.backend.service.PlatformStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================================
 * PLATFORM STATS SERVICE IMPLEMENTATION
 * ============================================================================
 * Centralized statistics calculations for admin dashboard.
 */
@Service
@RequiredArgsConstructor
public class PlatformStatsServiceImpl implements PlatformStatsService {

    private static final BigDecimal PLATFORM_COMMISSION_RATE = BigDecimal.valueOf(0.10);

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final TransactionRepository transactionRepository;
    private final DisputeRepository disputeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    @Override
    public PlatformStatsResponse getPlatformStats() {

        // ---------------------------------------------------------------------
        // USER STATS
        // ---------------------------------------------------------------------
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long bannedUsers = userRepository.countByIsBannedTrue();

        // ---------------------------------------------------------------------
        // JOB STATS
        // ---------------------------------------------------------------------
        long totalJobs = jobRepository.count();
        long openJobs = jobRepository.countByStatus("OPEN");
        long completedJobs = jobRepository.countByStatus("COMPLETED");

        // ---------------------------------------------------------------------
        // TRANSACTION STATS
        // ---------------------------------------------------------------------
        long totalTransactions = transactionRepository.count();

        BigDecimal totalRevenue = transactionRepository.sumCompletedTransactionAmounts()
                .orElse(BigDecimal.ZERO);

        BigDecimal platformEarnings = totalRevenue.multiply(PLATFORM_COMMISSION_RATE);

        // ---------------------------------------------------------------------
        // DISPUTE STATS
        // ---------------------------------------------------------------------
        long totalDisputes = disputeRepository.count();
        long openDisputes = disputeRepository.countByStatus(DisputeStatus.OPEN);

        // ---------------------------------------------------------------------
        // JOBS BY CATEGORY
        // ---------------------------------------------------------------------
        Map<String, Long> jobsByCategory = new HashMap<>();
        serviceCategoryRepository.findAll().forEach(category -> {
            long count = jobRepository.countByCategories_CategoryId(category.getCategoryId());
            jobsByCategory.put(category.getCategoryName(), count);
        });

        return new PlatformStatsResponse(
                totalUsers,
                activeUsers,
                bannedUsers,
                totalJobs,
                openJobs,
                completedJobs,
                totalTransactions,
                totalRevenue,
                platformEarnings,
                totalDisputes,
                openDisputes,
                jobsByCategory);
    }
}

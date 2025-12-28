package com.elwaseet.backend.dto.common;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Aggregated admin dashboard statistics.
 */
public record PlatformStatsResponse(

                // Users
                long totalUsers,
                long activeUsers,
                long bannedUsers,

                // Jobs
                long totalJobs,
                long openJobs,
                long completedJobs,

                // Transactions
                long totalTransactions,
                BigDecimal totalRevenue,
                BigDecimal platformEarnings,

                // Disputes
                long totalDisputes,
                long openDisputes,

                // Services
                Map<String, Long> jobsByCategory) {
}

package com.elwaseet.backend.service;

import com.elwaseet.backend.dto.common.PlatformStatsResponse;

/**
 * ============================================================================
 * PLATFORM STATS SERVICE
 * ============================================================================
 * Provides aggregated statistics for the admin dashboard.
 */
public interface PlatformStatsService {

    /**
     * Collects and calculates global platform statistics.
     */
    PlatformStatsResponse getPlatformStats();
}

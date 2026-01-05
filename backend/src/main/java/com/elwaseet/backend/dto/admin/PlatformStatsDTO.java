package com.elwaseet.backend.dto.admin;

import java.math.BigDecimal;
import java.util.Map;

/**
 * ============================================================================
 * PLATFORM STATS DTO
 * ============================================================================
 * Data Transfer Object used by Admin Dashboard to expose
 * aggregated platform statistics.
 *
 * This DTO is READ-ONLY and contains pre-calculated values
 * returned by AdminStatsService.
 */
public class PlatformStatsDTO {

    // -------------------------------------------------------------------------
    // USER STATISTICS
    // -------------------------------------------------------------------------

    /** Total registered users */
    private Long totalUsers;

    /** Total users with CUSTOMER role */
    private Long totalCustomers;

    /** Total users with PROVIDER role */
    private Long totalProviders;

    /** Providers that are verified */
    private Long verifiedProviders;

    // -------------------------------------------------------------------------
    // JOB STATISTICS
    // -------------------------------------------------------------------------

    /** Total jobs created on the platform */
    private Long totalJobs;

    /** Jobs currently open or in progress */
    private Long activeJobs;

    /** Jobs marked as completed */
    private Long completedJobs;

    // -------------------------------------------------------------------------
    // TRANSACTION STATISTICS
    // -------------------------------------------------------------------------

    /** Total number of transactions */
    private Long totalTransactions;

    /** Sum of completed transaction amounts */
    private BigDecimal totalRevenue;

    /** Platform earnings (e.g. 10% commission) */
    private BigDecimal platformEarnings;

    // -------------------------------------------------------------------------
    // DISPUTE STATISTICS
    // -------------------------------------------------------------------------

    /** Disputes currently pending */
    private Long pendingDisputes;

    /** Disputes resolved by admin */
    private Long resolvedDisputes;

    // -------------------------------------------------------------------------
    // CATEGORY BREAKDOWN
    // -------------------------------------------------------------------------

    /** Job count grouped by service category name */
    private Map<String, Long> jobsByCategory;

    // -------------------------------------------------------------------------
    // CONSTRUCTORS
    // -------------------------------------------------------------------------

    public PlatformStatsDTO() {
        // Default constructor for serialization
    }

    public PlatformStatsDTO(
            Long totalUsers,
            Long totalCustomers,
            Long totalProviders,
            Long verifiedProviders,
            Long totalJobs,
            Long activeJobs,
            Long completedJobs,
            Long totalTransactions,
            BigDecimal totalRevenue,
            BigDecimal platformEarnings,
            Long pendingDisputes,
            Long resolvedDisputes,
            Map<String, Long> jobsByCategory) {
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalProviders = totalProviders;
        this.verifiedProviders = verifiedProviders;
        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.completedJobs = completedJobs;
        this.totalTransactions = totalTransactions;
        this.totalRevenue = totalRevenue;
        this.platformEarnings = platformEarnings;
        this.pendingDisputes = pendingDisputes;
        this.resolvedDisputes = resolvedDisputes;
        this.jobsByCategory = jobsByCategory;
    }

    // -------------------------------------------------------------------------
    // GETTERS & SETTERS
    // -------------------------------------------------------------------------

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getTotalProviders() {
        return totalProviders;
    }

    public void setTotalProviders(Long totalProviders) {
        this.totalProviders = totalProviders;
    }

    public Long getVerifiedProviders() {
        return verifiedProviders;
    }

    public void setVerifiedProviders(Long verifiedProviders) {
        this.verifiedProviders = verifiedProviders;
    }

    public Long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(Long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public Long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(Long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public Long getCompletedJobs() {
        return completedJobs;
    }

    public void setCompletedJobs(Long completedJobs) {
        this.completedJobs = completedJobs;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getPlatformEarnings() {
        return platformEarnings;
    }

    public void setPlatformEarnings(BigDecimal platformEarnings) {
        this.platformEarnings = platformEarnings;
    }

    public Long getPendingDisputes() {
        return pendingDisputes;
    }

    public void setPendingDisputes(Long pendingDisputes) {
        this.pendingDisputes = pendingDisputes;
    }

    public Long getResolvedDisputes() {
        return resolvedDisputes;
    }

    public void setResolvedDisputes(Long resolvedDisputes) {
        this.resolvedDisputes = resolvedDisputes;
    }

    public Map<String, Long> getJobsByCategory() {
        return jobsByCategory;
    }

    public void setJobsByCategory(Map<String, Long> jobsByCategory) {
        this.jobsByCategory = jobsByCategory;
    }
}

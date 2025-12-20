package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Application;
import com.elwaseet.backend.entity.Application.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing job applications
 * Used by Samah for application CRUD operations
 * Used by John for accept application functionality
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /**
     * Check if a provider has already applied to a job
     * Prevents duplicate applications (business rule)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Application a WHERE a.job.jobId = :jobId AND a.provider.userId = :providerId")
    boolean existsByJobIdAndProviderId(@Param("jobId") Long jobId, @Param("providerId") Long providerId);

    /**
     * Find all applications for a specific job (for customer to review)
     * Orders by application date (newest first)
     */
    @Query("SELECT a FROM Application a WHERE a.job.jobId = :jobId ORDER BY a.appliedAt DESC")
    List<Application> findByJobIdOrderByAppliedAtDesc(@Param("jobId") Long jobId);

    /**
     * Find paginated applications for a job (if there are many applications)
     */
    @Query("SELECT a FROM Application a WHERE a.job.jobId = :jobId")
    Page<Application> findByJobId(@Param("jobId") Long jobId, Pageable pageable);

    /**
     * Find all applications by a specific provider (My Applications page)
     */
    @Query("SELECT a FROM Application a WHERE a.provider.userId = :providerId ORDER BY a.appliedAt DESC")
    Page<Application> findByProviderId(@Param("providerId") Long providerId, Pageable pageable);

    /**
     * Find applications by provider with status filter
     */
    @Query("SELECT a FROM Application a WHERE a.provider.userId = :providerId AND a.status = :status ORDER BY a.appliedAt DESC")
    Page<Application> findByProviderIdAndStatus(@Param("providerId") Long providerId, 
                                               @Param("status") ApplicationStatus status, 
                                               Pageable pageable);

    /**
     * Count applications for a job by status (for job cards showing "5 applications")
     */
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.jobId = :jobId AND a.status = :status")
    long countByJobIdAndStatus(@Param("jobId") Long jobId, @Param("status") ApplicationStatus status);

    /**
     * Count total applications for a job
     */
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.jobId = :jobId AND a.status NOT IN ('CANCELLED')")
       long countByJobId(@Param("jobId") Long jobId);

    /**
     * Find specific application by job and provider (used for acceptance)
     */
    @Query("SELECT a FROM Application a WHERE a.job.jobId = :jobId AND a.provider.userId = :providerId")
    Optional<Application> findByJobIdAndProviderId(@Param("jobId") Long jobId, @Param("providerId") Long providerId);

    /**
     * Find accepted application for a job
     */
    @Query("SELECT a FROM Application a WHERE a.job.jobId = :jobId AND a.status = 'ACCEPTED'")
    Optional<Application> findAcceptedApplicationByJobId(@Param("jobId") Long jobId);

    /**
     * Find all pending applications for a job (to reject them when one is accepted)
     */
    @Query("SELECT a FROM Application a WHERE a.job.jobId = :jobId AND a.status = 'PENDING'")
    List<Application> findPendingApplicationsByJobId(@Param("jobId") Long jobId);

    /**
     * Find applications for jobs owned by a specific customer
     */
    @Query("SELECT a FROM Application a WHERE a.job.customer.userId = :customerId ORDER BY a.appliedAt DESC")
    Page<Application> findApplicationsForCustomerJobs(@Param("customerId") Long customerId, Pageable pageable);

    /**
     * Advanced search for applications (if needed)
     */
    @Query("SELECT a FROM Application a WHERE " +
           "(:jobId IS NULL OR a.job.jobId = :jobId) AND " +
           "(:providerId IS NULL OR a.provider.userId = :providerId) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Application> findApplicationsWithFilters(@Param("jobId") Long jobId,
                                                  @Param("providerId") Long providerId,
                                                  @Param("status") ApplicationStatus status,
                                                  Pageable pageable);
}
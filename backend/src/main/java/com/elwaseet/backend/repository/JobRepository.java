package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.elwaseet.backend.entity.Job.JobStatus;

/**
 * ============================================================================
 * JOB REPOSITORY
 * ============================================================================
 * Data access layer for jobs.
 * Used by job workflows, admin dashboard, and platform statistics.
 */
@Repository
public interface JobRepository
        extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    /**
     * Count jobs belonging to a specific service category.
     * Matches Job.categories (Set<ServiceCategory>)
     * Matches ServiceCategory.categoryId (Integer)
     */
    long countByCategories_CategoryId(Integer categoryId);

    long countByStatus(JobStatus status);
}
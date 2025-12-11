package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // Team will add custom query methods as needed
}

package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.EmailQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailQueueRepository extends JpaRepository<EmailQueue, Long> {
    // Team will add custom query methods as needed
}

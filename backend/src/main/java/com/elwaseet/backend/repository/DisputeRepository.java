package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.Dispute.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    long countByStatus(DisputeStatus status);
}

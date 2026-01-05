package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.DisputeAppeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeAppealRepository extends JpaRepository<DisputeAppeal, Long> {
}

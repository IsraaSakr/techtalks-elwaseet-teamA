package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.ProviderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    // Team will add custom query methods as needed
}

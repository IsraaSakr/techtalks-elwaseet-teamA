package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    
    Optional<ProviderProfile> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
}

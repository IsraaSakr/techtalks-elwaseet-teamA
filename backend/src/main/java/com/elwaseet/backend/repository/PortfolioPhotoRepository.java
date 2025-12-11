package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.PortfolioPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioPhotoRepository extends JpaRepository<PortfolioPhoto, Long> {
    // Team will add custom query methods as needed
}

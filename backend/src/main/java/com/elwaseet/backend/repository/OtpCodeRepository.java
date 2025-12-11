package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    // Team will add custom query methods as needed
}

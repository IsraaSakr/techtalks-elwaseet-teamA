package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.JobPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPhotoRepository extends JpaRepository<JobPhoto, Long> {
    // Team will add custom query methods as needed
}

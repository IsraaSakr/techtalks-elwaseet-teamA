package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.ServicePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicePhotoRepository extends JpaRepository<ServicePhoto, Long> {
    // Team will add custom query methods as needed
}

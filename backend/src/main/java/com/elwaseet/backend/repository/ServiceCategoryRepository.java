package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.ServiceCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    List<ServiceCategory> findByIsActiveTrue();
}

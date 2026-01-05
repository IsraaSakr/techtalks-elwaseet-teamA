package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.DisputeEvidencePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeEvidencePhotoRepository extends JpaRepository<DisputeEvidencePhoto, Long> {


    List<DisputeEvidencePhoto> findByDispute_DisputeId(Long disputeId);


    List<DisputeEvidencePhoto> findByDispute(Dispute dispute);
}

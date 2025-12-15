package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.PortfolioPhoto;
import com.elwaseet.backend.entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioPhotoRepository extends JpaRepository<PortfolioPhoto, Long> {

    /**
     * Find a portfolio photo by its URL.
     * @param photoUrl the photo URL
     * @return optional PortfolioPhoto
     */
    Optional<PortfolioPhoto> findByPhotoUrl(String photoUrl);

    /**
     * Count the number of photos associated with a provider profile.
     * @param profileId the provider profile ID
     * @return number of photos
     */
    int countByProviderProfile_ProfileId(Long profileId);

    /**
     * Find all photos for a provider profile ordered by uploadOrder ascending.
     * @param profile the provider profile
     * @return list of PortfolioPhoto
     */
    List<PortfolioPhoto> findAllByProviderProfileOrderByUploadOrderAsc(ProviderProfile profile);
}

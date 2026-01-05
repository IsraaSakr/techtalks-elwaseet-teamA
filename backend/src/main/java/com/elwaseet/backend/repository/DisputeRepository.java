package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.Dispute.DisputeStatus;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    // Find all disputes opened by a specific user
    List<Dispute> findByOpenedBy(User openedBy);
    long countByStatus(DisputeStatus status);
    
    // Optimized query with JOIN FETCH
    @Query("SELECT d FROM Dispute d " +
           "LEFT JOIN FETCH d.evidencePhotos " +
           "WHERE d.openedBy = :user " +
           "ORDER BY d.openedAt DESC")
    List<Dispute> findByOpenedByWithPhotos(@Param("user") User user);

    @Query("SELECT d FROM Dispute d LEFT JOIN FETCH d.evidencePhotos WHERE d.disputeId = :id")
        Optional<Dispute> findByIdWithPhotos(@Param("id") Long id);

    // Optional: find by transaction
    Dispute findByTransaction_TransactionId(Long transactionId);
    boolean existsByTransaction(Transaction transaction);

     /**
     * Find disputes by status (for admin filtering)
     * Used in admin dashboard to filter by OPEN, UNDER_REVIEW, RESOLVED, APPEALED
     * 
     * @param status Dispute status to filter by
     * @param pageable Pagination info
     * @return Paginated disputes with the given status
     */
    Page<Dispute> findByStatus(DisputeStatus status, Pageable pageable);

}

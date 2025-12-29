package com.elwaseet.backend.repository;

import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.Transaction;
import com.elwaseet.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    // Find all disputes opened by a specific user
    List<Dispute> findByOpenedBy(User openedBy);

    // Optional: find by transaction
    Dispute findByTransaction_TransactionId(Long transactionId);
    boolean existsByTransaction(Transaction transaction);

}

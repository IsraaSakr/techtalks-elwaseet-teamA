package com.elwaseet.backend.policy;

import com.elwaseet.backend.entity.Transaction.TransactionStatus;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;
@Component
public class TransactionTransitionPolicy {

    private static final Map<TransactionStatus, Set<TransactionStatus>> ALLOWED = Map.of(
        TransactionStatus.COMMITTED, Set.of(TransactionStatus.IN_PROGRESS),
        TransactionStatus.IN_PROGRESS, Set.of(TransactionStatus.COMPLETED),
        TransactionStatus.COMPLETED, Set.of(TransactionStatus.CONFIRMED, TransactionStatus.DISPUTED),
        TransactionStatus.CONFIRMED, Set.of(TransactionStatus.PAID),
        TransactionStatus.PAID, Set.of(),
        TransactionStatus.DISPUTED, Set.of(TransactionStatus.RESOLVED),
        TransactionStatus.RESOLVED, Set.of()
    );

    public boolean canTransition(TransactionStatus from, TransactionStatus to) {
        return ALLOWED.getOrDefault(from, Set.of()).contains(to);
    }

    public void assertTransition(TransactionStatus from, TransactionStatus to) {
        if (!canTransition(from, to)) {
            throw new IllegalStateException("Invalid transition: " + from + " → " + to);
        }
    }
}

package com.elwaseet.backend.specification;

import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.Job.JobStatus;
import com.elwaseet.backend.entity.Job.Urgency;
import com.elwaseet.backend.entity.Location;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;

public class JobSpecifications {
    public static Specification<Job> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null ? null :
                cb.equal(root.join("categories").get("id"), categoryId);
    }

    public static Specification<Job> inLocation(Location location) {
        return (root, query, cb) -> location == null ? null :
                cb.equal(root.get("location"), location);
    }

    public static Specification<Job> budgetMin(BigDecimal min) {
        return (root, query, cb) -> min == null ? null :
                cb.greaterThanOrEqualTo(root.get("budgetMin"), min);
    }

    public static Specification<Job> budgetMax(BigDecimal max) {
        return (root, query, cb) -> max == null ? null :
                cb.lessThanOrEqualTo(root.get("budgetMax"), max);
    }

    public static Specification<Job> urgencyIs(Urgency urgency) {
        return (root, query, cb) -> urgency == null ? null :
                cb.equal(root.get("urgency"), urgency);
    }

    public static Specification<Job> statusIs(JobStatus status) {
        return (root, query, cb) -> status == null ? null :
                cb.equal(root.get("status"), status);
    }

    public static Specification<Job> onlyOpenByDefault(JobStatus status) {
        return (root, query, cb) -> status != null ? null :
                cb.equal(root.get("status"), JobStatus.OPEN);
    }
}
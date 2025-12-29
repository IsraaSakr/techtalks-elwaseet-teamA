package com.elwaseet.backend.dto.dispute;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import com.elwaseet.backend.entity.Dispute;

@Data
public class DisputeCreateRequest {
    private Long transactionId;
    private Long customerId;
    private Dispute.DisputeReason reasonCategory;  
    private String description;
    private List<MultipartFile> evidenceFiles;
}
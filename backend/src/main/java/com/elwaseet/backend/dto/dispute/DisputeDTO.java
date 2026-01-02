package com.elwaseet.backend.dto.dispute;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DisputeDTO {
    private Long disputeId;
    private Long transactionId;
    private String status;
    private LocalDateTime openedAt;
    private LocalDateTime resolvedAt;
    private List<DisputeEvidencePhotoDTO> evidencePhotos;
}
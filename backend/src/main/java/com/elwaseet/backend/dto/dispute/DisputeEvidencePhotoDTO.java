package com.elwaseet.backend.dto.dispute;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DisputeEvidencePhotoDTO {
    private Long photoId;        // matches entity
    private String photoUrl;     // matches entity
    private LocalDateTime uploadedAt;
}
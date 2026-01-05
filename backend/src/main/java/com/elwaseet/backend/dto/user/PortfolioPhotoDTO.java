package com.elwaseet.backend.dto.user;

import lombok.Data;
import java.time.LocalDateTime;
import com.elwaseet.backend.entity.PortfolioPhoto;

/**
 * Data Transfer Object representing a provider's portfolio photo.
 *
 * This DTO is used to expose portfolio photo data to clients
 * without leaking internal entity implementation details.
 */
@Data
public class PortfolioPhotoDTO {

    /**
     * Unique identifier of the portfolio photo.
     */
    private Long photoId;

    /**
     * Publicly accessible URL of the portfolio photo.
     */
    private String photoUrl;

    /**
     * Order in which the photo should be displayed in the portfolio.
     */
    private Integer uploadOrder;

    /**
     * Timestamp indicating when the photo was uploaded.
     */
    private LocalDateTime uploadedAt;

    /**
     * Constructs a DTO from a {@link PortfolioPhoto} entity.
     *
     * @param photo the portfolio photo entity to convert
     */
    public PortfolioPhotoDTO(PortfolioPhoto photo) {
        this.photoId = photo.getPhotoId();
        this.photoUrl = photo.getPhotoUrl();
        this.uploadOrder = photo.getUploadOrder();
        this.uploadedAt = photo.getUploadedAt();
    }
}

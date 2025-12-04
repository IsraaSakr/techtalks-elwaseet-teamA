package com.elwaseet.backend.model.profile;

import com.elwaseet.backend.model.user.User;
import com.elwaseet.backend.model.user.Location;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "provider_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfile {

    @Id
    private UUID userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String bio;
    private String availabilityText;

    @ElementCollection
    private List<String> portfolioPhotos;

    private boolean verifiedBadge;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Location> serviceAreas;

}

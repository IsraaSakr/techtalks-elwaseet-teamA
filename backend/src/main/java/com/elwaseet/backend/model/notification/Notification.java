package com.elwaseet.backend.model.notification;

import com.elwaseet.backend.model.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private String title;
    private String message;
    private String link;
    private boolean read;

    private Date createdAt;
}

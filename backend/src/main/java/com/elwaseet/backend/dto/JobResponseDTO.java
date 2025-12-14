package com.elwaseet.backend.dto;


import lombok.*;             
import java.util.List;        

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String urgency;
    private Double budgetMin;
    private Double budgetMax;
    private String status;
    private List<String> photoUrls;
}


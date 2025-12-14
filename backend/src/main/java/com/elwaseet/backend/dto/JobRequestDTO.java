package com.elwaseet.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequestDTO {
    @NotBlank @Size(min = 10, max = 100)
    private String title;

    @NotBlank @Size(min = 50, max = 1000)
    private String description;

    @NotNull private Long categoryId;

    @NotNull @DecimalMin("0.0") private Double budgetMin;
    @NotNull @DecimalMin("0.0") private Double budgetMax;

    @NotBlank private String location;
    @NotBlank private String urgency;
}
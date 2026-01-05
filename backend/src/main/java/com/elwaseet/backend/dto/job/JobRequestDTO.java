package com.elwaseet.backend.dto.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.elwaseet.backend.entity.Job;
import com.elwaseet.backend.entity.Location;
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

    @NotNull private Location location;
    @NotNull private Job.Urgency urgency; 
}
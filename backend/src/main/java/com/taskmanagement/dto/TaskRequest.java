package com.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record TaskRequest(
        @NotBlank(message = "Title must not be blank") String title,
        String description,
        String priority,
        LocalDate dueDate
) {}

package com.taskmanagement.dto;

import java.time.LocalDate;

public record TaskUpdateRequest(
        String title,
        String description,
        String status,
        String priority,
        LocalDate dueDate
) {}

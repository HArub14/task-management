package com.taskmanagement.entity;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskUpdateRequest;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Getter
@NoArgsConstructor
public class Task {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    public Task(TaskRequest request, User createdBy) {
        this.id = UUID.randomUUID();
        this.title = request.title();
        this.description = request.description();
        this.status = "todo";
        this.priority = request.priority();
        this.dueDate = request.dueDate();
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(length = 20)
    private String priority;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void update(TaskUpdateRequest request) {
        if (request.title() != null) {
            this.title = request.title();
        }
        if (request.description() != null) {
            this.description = request.description();
        }
        if (request.status() != null) {
            this.status = request.status();
        }
        if (request.priority() != null) {
            this.priority = request.priority();
        }
        if (request.dueDate() != null) {
            this.dueDate = request.dueDate();
        }
        this.updatedAt = LocalDateTime.now();
    }
}

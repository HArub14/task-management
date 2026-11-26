package com.taskmanagement.repository;

import com.taskmanagement.entity.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    @Override
    @EntityGraph(attributePaths = {"assignee", "createdBy"})
    List<Task> findAll();

    @EntityGraph(attributePaths = {"assignee", "createdBy"})
    List<Task> findByStatus(String status);

    @EntityGraph(attributePaths = {"assignee", "createdBy"})
    List<Task> findByPriority(String priority);

    @EntityGraph(attributePaths = {"assignee", "createdBy"})
    List<Task> findByStatusAndPriority(String status, String priority);
}

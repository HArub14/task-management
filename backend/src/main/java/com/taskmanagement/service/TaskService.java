package com.taskmanagement.service;

import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskResponse> getTasks(String status, String priority) {
        if (status != null && priority != null) {
            return taskRepository.findByStatusAndPriority(status, priority)
                    .stream().map(TaskResponse::from).toList();
        }
        if (status != null) {
            return taskRepository.findByStatus(status)
                    .stream().map(TaskResponse::from).toList();
        }
        if (priority != null) {
            return taskRepository.findByPriority(priority)
                    .stream().map(TaskResponse::from).toList();
        }
        return taskRepository.findAll()
                .stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getTaskById(UUID id) {
        return taskRepository.findById(id)
                .map(TaskResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id));
    }
}

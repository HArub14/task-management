package com.taskmanagement.service;

import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.dto.TaskUpdateRequest;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
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
    private final UserRepository userRepository;

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

    @Transactional
    public TaskResponse updateTask(UUID id, TaskUpdateRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id));
        task.update(request);
        return TaskResponse.from(task);
    }

    @Transactional
    public void deleteTask(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        // 暫定: DB の最初のユーザーを作成者とする（認証実装後に差し替え）
        User createdBy = userRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No user found"));
        Task task = new Task(request, createdBy);
        return TaskResponse.from(taskRepository.save(task));
    }
}

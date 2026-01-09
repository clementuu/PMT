package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.dto.Assigned;
import com.pmt.errors.ValidationException;
import com.pmt.model.Task;
import com.pmt.model.TaskAssign;
import com.pmt.model.User;
import com.pmt.service.TaskAssignService;
import com.pmt.store.TaskAssignStore;
import com.pmt.store.TaskStore;
import com.pmt.store.UserStore;

@Service
public class TaskAssignServiceImpl implements TaskAssignService {
    @Autowired
    TaskAssignStore taskAssignStore;
    @Autowired
    UserStore userStore;
    @Autowired
    TaskStore taskStore;

    @Override
    public TaskAssign create(Long taskId, Long userId) {
        TaskAssign taskAssign = new TaskAssign();
        Task task = taskStore.findById(taskId)
                .orElseThrow(() -> new ValidationException("Task not found with ID: " + taskId));
        User user = userStore.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found with ID: " + userId));
        
        taskAssign.setTask(task);
        taskAssign.setUser(user);
        return taskAssignStore.save(taskAssign);
    }

    @Override
    public void deleteByTaskId(Long id) {
        if(id == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        taskAssignStore.deleteByTaskId(id);
    }

    @Override
    public List<Assigned> getUsersByTaskId(Long taskId) {
        if(taskId == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        List<Assigned> users = new ArrayList<>();
        List<TaskAssign> taskAssigns = taskAssignStore.findByTaskId(taskId);

        for (TaskAssign taskAssign : taskAssigns) {
            if (taskAssign.getUser() != null) {
                Optional<User> userOpt = userStore.findById(taskAssign.getUser().getId());
                userOpt.ifPresent(user -> {
                    Assigned assigned = new Assigned(taskAssign.getId(), user.getId(), taskAssign.getTask().getId(), user.getNom());
                    users.add(assigned);
                });
            }
        }

        return users;
    }

    @Override
    public void deleteById(Long id) {
         if(id == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        taskAssignStore.deleteById(id);
    }
}

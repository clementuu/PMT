package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        Task task = taskStore.findById(taskId).get();
        if (task == null) {
            throw new ValidationException("task cannot be null");
        }
        User user = userStore.findById(userId).get();
        if (user == null) {
            throw new ValidationException("user cannot be null");
        }
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
    public List<User> getUsersByTaskId(Long taskId) {
        if(taskId == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        List<User> users = new ArrayList<>();
        List<TaskAssign> taskAssigns = taskAssignStore.findByTaskId(taskId);

        for (TaskAssign taskAssign : taskAssigns) {
            System.out.println(taskAssign.getUser());
            User user = userStore.findById(taskAssign.getUser().getId()).get();
            users.add(user);
        }

        return users;
    }
}

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
import com.pmt.service.EmailService;
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
    @Autowired
    EmailService emailService;

    @Override
    public TaskAssign create(Long taskId, Long userId) {
        Task task = taskStore.findById(taskId)
                .orElseThrow(() -> new ValidationException("Task not found with ID: " + taskId));
        User user = userStore.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found with ID: " + userId));
        
        TaskAssign taskAssign = new TaskAssign();
        taskAssign.setTask(task);
        taskAssign.setUser(user);
        
        TaskAssign savedTaskAssign = taskAssignStore.save(taskAssign);

        try {
            String to = user.getEmail();
            String subject = "Nouvelle tâche assignée : " + task.getNom();
            String text = "Bonjour " + user.getNom() + ",\n\n"
                        + "Vous avez été assigné(e) à une nouvelle tâche : '" + task.getNom() + "'.\n\n"
                        + "L'équipe PMT.";

            emailService.sendSimpleMessage(to, subject, text);
            System.out.println("Email de notification envoyé à " + to);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email de notification à " + user.getEmail() + e);
        }

        return savedTaskAssign;
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

package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

/**
 * Implémentation du service pour la gestion des assignations de tâches aux utilisateurs.
 * Gère la création, la suppression et la récupération des assignations.
 */
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

    private static final Logger logger = LoggerFactory.getLogger(TaskAssignServiceImpl.class);

    /**
     * Crée une nouvelle assignation d'une tâche à un utilisateur.
     * Envoie un e-mail de notification à l'utilisateur assigné.
     * @param taskId L'ID de la tâche à assigner.
     * @param userId L'ID de l'utilisateur à qui la tâche est assignée.
     * @return L'objet TaskAssign créé.
     * @throws ValidationException si la tâche ou l'utilisateur n'est pas trouvé.
     */
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
            String subject = "Nouvelle tâche assignée : " + task.getNom(); // Assurez-vous que Task a bien getTitre() ou getNom()
            String text = "Bonjour " + user.getNom() + ",\n\n"
                        + "Vous avez été assigné(e) à une nouvelle tâche : '" + task.getNom() + "'.\n\n" // Assurez-vous que Task a bien getTitre() ou getNom()
                        + "L'équipe PMT.";

            emailService.sendSimpleMessage(to, subject, text);
            logger.info("Email de notification envoyé à " + to);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email de notification à " + user.getEmail(), e);
        }

        return savedTaskAssign;
    }

    /**
     * Supprime toutes les assignations liées à une tâche spécifique.
     * @param id L'ID de la tâche.
     * @throws ValidationException si l'ID est null.
     */
    @Override
    public void deleteByTaskId(Long id) {
        if(id == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        taskAssignStore.deleteByTaskId(id);
    }

    /**
     * Récupère la liste des utilisateurs assignés à une tâche spécifique.
     * @param taskId L'ID de la tâche.
     * @return Une liste d'objets Assigned représentant les utilisateurs assignés.
     * @throws ValidationException si l'ID de la tâche est null.
     */
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

    /**
     * Supprime une assignation de tâche par son identifiant unique.
     * @param id L'ID de l'assignation à supprimer.
     * @throws ValidationException si l'ID est null.
     */
    @Override
    public void deleteById(Long id) {
         if(id == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        taskAssignStore.deleteById(id);
    }
}

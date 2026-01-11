package com.pmt.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pmt.dto.ProjectUpdate;
import com.pmt.errors.ValidationException;
import com.pmt.model.Historique;
import com.pmt.model.Project;
import com.pmt.model.Task;
import com.pmt.model.Type;
import com.pmt.model.User;
import com.pmt.service.ProjectService;
import com.pmt.service.UserService;
import com.pmt.store.HistoriqueStore;
import com.pmt.store.ProjectStore;
import com.pmt.store.TaskStore;
import com.pmt.store.ProjectUserStore;
import com.pmt.store.TaskAssignStore;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    ProjectStore projectStore;
    @Autowired
    TaskStore taskStore;
    @Autowired
    TaskAssignStore taskAssignStore;
    @Autowired
    ProjectUserStore projectUserStore;
    @Autowired
    HistoriqueStore historiqueStore;

    @Autowired
    UserService userService;

    @Override
    public List<Project> findAll() {
        List<Project> projects = new ArrayList<Project>();
        projectStore.findAll().forEach(projects::add);
        
        return projects;
    }

    @Override
    public Project findById(Long id) {
        return projectStore.findById(id)
            .orElseThrow(() -> new ValidationException("Projet non trouvé avec l'ID: " + id));
    }

    @Override
    public Project create(Project project) {
        if(project.getNom() == null || project.getNom().isBlank()) {
            throw new ValidationException("Le projet doit avoir un nom");
        }

        if(project.getDescription() == null || project.getDescription().isBlank()) {
            throw new ValidationException("Le projet doit avoir une description");
        }

        return projectStore.save(project);
    }

    @Override
    public Project update(ProjectUpdate project) {
        if (project.getProject().getId() == null) {
            throw new ValidationException("L'ID du projet est requis pour la mise à jour.");
        }
        Project existingProject = projectStore.findById(project.getProject().getId())
                .orElseThrow(() -> new ValidationException("Le projet avec l'ID " + project.getProject().getId() + " n'existe pas."));

        User user = userService.findById(project.getUserId());

        // Historique pour le nom
        if (project.getProject().getNom() != null && !project.getProject().getNom().isBlank() && !project.getProject().getNom().equals(existingProject.getNom())) {
            Historique history = new Historique();
            history.setProjectId(existingProject.getId());
            history.setDateM(LocalDateTime.now());
            history.setTypeM(Type.Titre);
            history.setOldString(existingProject.getNom());
            history.setNewString(project.getProject().getNom());
            history.setUser(user);
            historiqueStore.save(history);
            existingProject.setNom(project.getProject().getNom());
        }

        // Historique pour la description
        if (project.getProject().getDescription() != null && !project.getProject().getDescription().equals(existingProject.getDescription())) {
            Historique history = new Historique();
            history.setProjectId(existingProject.getId());
            history.setDateM(LocalDateTime.now());
            history.setTypeM(Type.Description);
            history.setOldString(existingProject.getDescription());
            history.setNewString(project.getProject().getDescription());
            history.setUser(user);
            historiqueStore.save(history);
            existingProject.setDescription(project.getProject().getDescription());
        }

        if (project.getProject().getDateFin() != null) {
            existingProject.setDateFin(project.getProject().getDateFin());
        }

        return projectStore.save(existingProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        if (id == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        // Récupérer toutes les tâches du projet
        List<Task> tasks = taskStore.findByProjectId(id);
        
        // Supprimer les assignations liées à chaque tâche
        for (Task task : tasks) {
            taskAssignStore.deleteByTaskId(task.getId());
        }

        // Supprimer les tâches du projet
        taskStore.deleteByProjectId(id);

        // Supprimer les utilisateurs liés au projet
        projectUserStore.deleteByProjectId(id);

        // Supprimer le projet lui-même
        projectStore.deleteById(id);
    }
}

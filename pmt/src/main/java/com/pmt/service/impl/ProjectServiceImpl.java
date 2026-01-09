package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.Task;
import com.pmt.service.ProjectService;
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

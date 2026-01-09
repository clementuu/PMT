package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.dto.TaskDTO;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.Task;
import com.pmt.service.TaskService;
import com.pmt.store.ProjectStore;
import com.pmt.store.TaskAssignStore;
import com.pmt.store.TaskStore;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    TaskStore taskStore;
    @Autowired
    ProjectStore projectStore;
    @Autowired
    TaskAssignStore taskAssignStore;

    @Override
    public List<TaskDTO> findAll() {
        List<Task> tasks = new ArrayList<Task>();
        taskStore.findAll().forEach(tasks::add);

        List<TaskDTO> dtos = new ArrayList<TaskDTO>();

        for (Task task : tasks) {
            TaskDTO dto = new TaskDTO();

            dto.setId(task.getId());
            dto.setNom(task.getNom());
            dto.setDescription(task.getDescription());
            dto.setDateEcheance(task.getDateEcheance());
            dto.setDateFin(task.getDateFin());
            dto.setPriorite(task.getPriorite());
            dto.setStatus(task.getStatus());
            dto.setProjectId(task.getProject().getId());

            dtos.add(dto);
        }

        return dtos;
    }

    public TaskDTO findById(Long id) {
        Task task = taskStore.findById(id)
            .orElseThrow(() -> new ValidationException("Tâche non trouvé avec l'ID: " + id));

        TaskDTO dto = new TaskDTO();

        dto.setId(task.getId());
        dto.setNom(task.getNom());
        dto.setDescription(task.getDescription());
        dto.setDateEcheance(task.getDateEcheance());
        dto.setDateFin(task.getDateFin());
        dto.setPriorite(task.getPriorite());
        dto.setStatus(task.getStatus());
        dto.setProjectId(task.getProject().getId());

        return dto;
    }

    @Override
    public Task create(TaskDTO dto) {
        if(dto.getNom() == null || dto.getNom().isBlank()) {
            throw new ValidationException("La tâche doit avoir un nom");
        }
        // controle les tache sans projet
        if (dto.getProjectId() == null) {
            throw new ValidationException("La tâche doit être associée à un projet.");
        }
        // récupère le projet
        Optional<Project> projectOptional = projectStore.findById(dto.getProjectId());
        if (projectOptional.isEmpty()) {
            throw new ValidationException("Le projet spécifié n'existe pas.");
        }

        Task task = new Task();

        task.setNom(dto.getNom());
        task.setDescription(dto.getDescription());
        task.setDateEcheance(dto.getDateEcheance());
        task.setDateFin(dto.getDateFin());
        task.setPriorite(dto.getPriorite());
        task.setStatus(dto.getStatus());
        task.setProject(projectOptional.get());

        return taskStore.save(task);
    }

    @Override
    public Task update(Task task) {
        if (task.getId() == null) {
            throw new ValidationException("L'ID de la tâche est requis pour la mise à jour.");
        }
        Optional<Task> existingTaskOptional = taskStore.findById(task.getId());
        if (existingTaskOptional.isEmpty()) {
            throw new EntityNotFoundException("La tâche avec l'ID " + task.getId() + " n'existe pas.");
        }
        Task existingTask = existingTaskOptional.get();

        // met a jour les champs
        if (task.getNom() != null && !task.getNom().isBlank()) {
            existingTask.setNom(task.getNom());
        }
        if (task.getDescription() != null) {
            existingTask.setDescription(task.getDescription());
        }
        if (task.getDateFin() != null) {
            existingTask.setDateFin(task.getDateFin());
        }
        if (task.getDateEcheance() != null) {
            existingTask.setDateEcheance(task.getDateEcheance());
        }
        if (task.getPriorite() != null) {
            existingTask.setPriorite(task.getPriorite());
        }
        if (task.getStatus() != null) {
            existingTask.setStatus(task.getStatus());
        }

        // récupère le projet
        if (task.getProject() != null && task.getProject().getId() != null) {
            Optional<Project> projectOptional = projectStore.findById(task.getProject().getId());
            if (projectOptional.isEmpty()) {
                throw new ValidationException("Le projet spécifié pour la mise à jour n'existe pas.");
            }
            existingTask.setProject(projectOptional.get());
        } else if (existingTask.getProject() == null) {
            throw new ValidationException("Impossible de dissocier le projet car il est requis.");
        }

        return taskStore.save(existingTask);
    }

    @Override
    public void deleteById(Long taskId) {
        if(taskId == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        taskAssignStore.deleteByTaskId(taskId);
        taskStore.deleteById(taskId);
    }
}

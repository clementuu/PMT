package com.pmt.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.dto.TaskDTO;
import com.pmt.errors.ValidationException;
import com.pmt.model.Historique;
import com.pmt.model.Project;
import com.pmt.model.Task;
import com.pmt.model.Type;
import com.pmt.model.User;
import com.pmt.service.TaskService;
import com.pmt.service.UserService;
import com.pmt.store.HistoriqueStore;
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
    @Autowired
    HistoriqueStore historiqueStore;

    @Autowired
    UserService userService;

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
            throw new ValidationException("Le nom de la tâche est obligatoire.");
        }
        if(dto.getDescription() == null || dto.getDescription().isBlank()) {
            throw new ValidationException("La description de la tâche est obligatoire.");
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
    public TaskDTO update(TaskDTO task) {
        if (task.getId() == null) {
            throw new ValidationException("L'ID de la tâche est requis pour la mise à jour.");
        }
        if (task.getNom() == null || task.getNom() == "") {
            throw new ValidationException("Le nom de la tâche est obligatoire.");
        }
        if (task.getDescription() == null || task.getDescription() == "") {
            throw new ValidationException("La description de la tâche est obligatoire.");
        }
        Task existingTask = taskStore.findById(task.getId())
                .orElseThrow(() -> new EntityNotFoundException("La tâche avec l'ID " + task.getId() + " n'existe pas."));
                
        User user = userService.findById(task.getUserId());
        
        TaskDTO taskDTO = new TaskDTO();
        // Historique pour le nom
        if (task.getNom() != null && !task.getNom().isBlank() && !task.getNom().equals(existingTask.getNom())) {
            Historique history = new Historique();
            history.setTaskId(existingTask.getId());
            history.setDateM(LocalDateTime.now());
            history.setTypeM(Type.Titre);
            history.setOldString(existingTask.getNom());
            history.setNewString(task.getNom());
            history.setUser(user);
            historiqueStore.save(history);
            existingTask.setNom(task.getNom());
            taskDTO.setNom(task.getNom());
        }

        // Historique pour la description
        if (task.getDescription() != null && !task.getDescription().equals(existingTask.getDescription())) {
            Historique history = new Historique();
            history.setTaskId(existingTask.getId());
            history.setDateM(LocalDateTime.now());
            history.setTypeM(Type.Description);
            history.setOldString(existingTask.getDescription());
            history.setNewString(task.getDescription());
            history.setUser(user);
            historiqueStore.save(history);
            existingTask.setDescription(task.getDescription());
            taskDTO.setDescription(task.getDescription());
        }

        if (task.getDateFin() != null) {
            existingTask.setDateFin(task.getDateFin());
            taskDTO.setDateFin(task.getDateFin());
        }
        if (task.getDateEcheance() != null) {
            existingTask.setDateEcheance(task.getDateEcheance());
            taskDTO.setDateEcheance(task.getDateEcheance());
        }
        if (task.getPriorite() != null) {
            existingTask.setPriorite(task.getPriorite());
            taskDTO.setPriorite(task.getPriorite());
        }
        if (task.getStatus() != null) {
            existingTask.setStatus(task.getStatus());
            taskDTO.setStatus(task.getStatus());
        }

        // récupère le projet
        if (task.getProjectId() != null && task.getProjectId() != null) {
            Project project = projectStore.findById(task.getProjectId())
                    .orElseThrow(() -> new ValidationException("Le projet spécifié pour la mise à jour n'existe pas."));
            existingTask.setProject(project);
            taskDTO.setProjectId(project.getId());
        } else if (existingTask.getProject() == null) {
            throw new ValidationException("Impossible de dissocier le projet car il est requis.");
        }

        taskStore.save(existingTask);

        return taskDTO;
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

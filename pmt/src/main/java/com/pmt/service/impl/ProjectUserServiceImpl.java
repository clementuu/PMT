package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.dto.UsersProject;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import com.pmt.model.User;
import com.pmt.service.ProjectUserService;
import com.pmt.store.ProjectStore;
import com.pmt.store.ProjectUserStore;
import com.pmt.store.UserStore;

/**
 * Implémentation du service pour la gestion des associations entre projets et utilisateurs.
 * Permet d'ajouter des utilisateurs à des projets, de récupérer les projets d'un utilisateur
 * ou les utilisateurs d'un projet, et de supprimer ces associations.
 */
@Service
public class ProjectUserServiceImpl implements ProjectUserService {
    @Autowired
    ProjectUserStore projectUserStore;
    @Autowired
    ProjectStore projectStore;
    @Autowired
    UserStore userStore;

    /**
     * Récupère la liste de tous les projets auxquels un utilisateur est associé.
     * @param userId L'identifiant unique de l'utilisateur.
     * @return Une liste d'objets Project.
     */
    @Override
    public List<Project> getProjectsByUserId(Long userId) {
        return projectUserStore.findAllProjectByUserId(userId);
    }

    /**
     * Ajoute un ou plusieurs utilisateurs à un projet spécifique avec un rôle défini.
     * @param request L'objet UsersProject contenant l'ID du projet et une liste d'objets UserRoleDTO.
     * @return Une liste des objets ProjectUser nouvellement créés.
     * @throws ValidationException si le projet ou un utilisateur spécifié n'est pas trouvé.
     */
    @Override
    public List<ProjectUser> addUsersToProject(UsersProject request) {
        Project project = projectStore.findById(request.getProjectId())
                .orElseThrow(() -> new ValidationException("Project not found with ID: " + request.getProjectId()));

        List<ProjectUser> addedProjectUsers = new ArrayList<>();
        for (UsersProject.UserRoleDTO userRoleDTO : request.getUsers()) {
            User user = userStore.findById(userRoleDTO.getUserId())
                .orElseThrow(() -> new ValidationException("User not found with ID: " + userRoleDTO.getUserId()));

            ProjectUser newProjectUser = new ProjectUser();
            newProjectUser.setId(userRoleDTO.getId());
            newProjectUser.setProject(project);
            newProjectUser.setUser(user);
            newProjectUser.setRole(userRoleDTO.getRole());
            addedProjectUsers.add(projectUserStore.save(newProjectUser));
        }
        return addedProjectUsers;
    }

    /**
     * Récupère les détails de tous les utilisateurs associés à un projet donné.
     * @param projectId L'identifiant unique du projet.
     * @return Un objet UsersProject contenant l'ID du projet et une liste d'objets UserRoleDTO.
     */
    @Override
    public UsersProject getUsersProjectByProjectId(Long projectId) {
        List<ProjectUser> projectUsers = projectUserStore.findByProjectId(projectId);
        UsersProject usersProjectDTO = new UsersProject();

        if (projectUsers.isEmpty()) {
            usersProjectDTO.setProjectId(projectId); // Still set projectId even if no users
            usersProjectDTO.setUsers(new ArrayList<>());
            return usersProjectDTO;
        }

        // Assuming all projectUsers in the list belong to the same project
        usersProjectDTO.setProjectId(projectUsers.get(0).getProject().getId());

        List<UsersProject.UserRoleDTO> userRoleDTOs = projectUsers.stream()
                .map(pu -> {
                    UsersProject.UserRoleDTO dto = new UsersProject.UserRoleDTO();
                    dto.setId(pu.getId());
                    dto.setUserId(pu.getUser().getId());
                    dto.setRole(pu.getRole());
                    return dto;
                })
                .collect(Collectors.toList());

        usersProjectDTO.setUsers(userRoleDTOs);
        return usersProjectDTO;
    }

    /**
     * Supprime une association projet-utilisateur par son identifiant unique.
     * @param id L'identifiant unique de l'association ProjectUser.
     */
    public void deleteById(Long id) {
        projectUserStore.deleteById(id);
    }
}

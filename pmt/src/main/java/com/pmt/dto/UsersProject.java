package com.pmt.dto;

import com.pmt.model.Role;

import java.util.List;

/**
 * DTO représentant les utilisateurs associés à un projet avec leurs rôles.
 */
public class UsersProject {
    /**
     * L'identifiant du projet.
     */
    private Long projectId;
    /**
     * Liste des utilisateurs et de leurs rôles pour le projet.
     */
    private List<UserRoleDTO> users; // List of userId and role

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<UserRoleDTO> getUsers() {
        return users;
    }

    public void setUsers(List<UserRoleDTO> users) {
        this.users = users;
    }

    /**
     * DTO représentant l'identifiant d'un utilisateur et son rôle au sein d'un projet.
     */
    public static class UserRoleDTO {
        /**
         * Identifiant du UserProject (relation entre l'utilisateur et le projet).
         */
        private Long id;
        /**
         * Identifiant de l'utilisateur.
         */
        private Long userId;
        /**
         * Le rôle de l'utilisateur dans le projet.
         */
        private Role role;

        public Long getId() {
            return id;
        }
        public void setId(Long id) {
            this.id = id;
        }
        public Long getUserId() {
            return userId;
        }
        public void setUserId(Long userId) {
            this.userId = userId;
        }
        public Role getRole() {
            return role;
        }
        public void setRole(Role role) {
            this.role = role;
        }
    }
}
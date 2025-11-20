package com.pmt.dto;

import com.pmt.model.Role;

import java.util.List;

public class AddUsersProject {
    private Long projectId;
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

    public static class UserRoleDTO {
        private Long userId;
        private Role role;

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

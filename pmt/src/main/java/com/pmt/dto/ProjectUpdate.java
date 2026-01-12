package com.pmt.dto;

import com.pmt.model.Project;

/**
 * DTO représentant la mise à jour d'un projet.
 */
public class ProjectUpdate {
    /**
     * Le projet à mettre à jour.
     */
    private Project project;
    /**
     * L'identifiant de l'utilisateur effectuant la mise à jour.
     */
    private Long userId;

    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project = project;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }    
}
package com.pmt.dto;

import com.pmt.model.Project;

public class ProjectUpdate {
    private Project project;
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

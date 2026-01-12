package com.pmt.store;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Project;

/**
 * Interface de dépôt pour l'accès aux données des projets.
 */
public interface ProjectStore extends CrudRepository<Project, Long> {
}
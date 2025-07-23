package com.pmt.store;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Project;

public interface ProjectStore extends CrudRepository<Project, Integer> {
}

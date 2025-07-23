package com.pmt.store;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Task;

public interface TaskStore extends CrudRepository<Task, Integer> {
}

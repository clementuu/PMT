package com.pmt.store;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.User;

public interface UserStore extends CrudRepository<User, Integer> {
}

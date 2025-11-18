package com.pmt.store;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.User;


public interface UserStore extends CrudRepository<User, Integer> {
    @Override
    Optional<User> findById(Integer id);
    Optional<User> findByEmail(String email);
}

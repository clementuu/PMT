package com.pmt.store;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.User;



public interface UserStore extends CrudRepository<User, Long> {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

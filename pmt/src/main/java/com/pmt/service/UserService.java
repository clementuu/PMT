package com.pmt.service;

import java.util.List;

import com.pmt.model.User;

public interface UserService {
    List<User> findAll();
    User create(User user);
    User login(String email, String password);
}

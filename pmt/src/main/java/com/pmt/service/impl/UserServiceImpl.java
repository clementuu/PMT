package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.model.User;
import com.pmt.service.UserService;
import com.pmt.store.UserStore;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserStore userStore;

    @Override
    public List<User> findAll() {
        List<User> users = new ArrayList<User>();
        userStore.findAll().forEach(users::add);

        return users;
    }

}

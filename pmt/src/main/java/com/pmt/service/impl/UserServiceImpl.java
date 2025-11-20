package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.errors.AuthException;
import com.pmt.errors.ValidationException;
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

    @Override
    public User findById(Long id) {
        User user = new User();
        user = userStore.findById(id).get();
        return user;
    }

    // Crée un utilisateur en controlant la validité des champs
    @Override
    public User create(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ValidationException("L'email est obligatoire.");
        }

        if (user.getNom() == null || user.getNom().isBlank()) {
            throw new ValidationException("Le nom d'utilisateur est obligatoire.");
        }

        if (user.getMdp() == null || user.getMdp().isBlank()) {
            throw new ValidationException("Le mot de passe est obligatoire.");
        }

        if (user.getMdp().length() < 4) {
            throw new ValidationException("Le mot de passe doit contenir au moins 4 caractères.");
        }

        if (userStore.existsByEmail(user.getEmail())) {
            throw new ValidationException("Cet email est déjà utilisé.");
        }
    
        return userStore.save(user);
    }

    // Authentifie un utilisateur
    @Override
    public User login(String email, String password) {
        User user = userStore.findByEmail(email)
            .orElseThrow(() -> new AuthException("Utilisateur non trouvé avec cet email."));

        if (!user.getMdp().equals(password)) {
            throw new AuthException("Mot de passe incorrect.");
        }

        return user;
    }
}

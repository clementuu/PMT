package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.errors.AuthException;
import com.pmt.errors.ValidationException;
import com.pmt.model.ProjectUser;
import com.pmt.model.User;
import com.pmt.service.UserService;
import com.pmt.store.ProjectUserStore;
import com.pmt.store.UserStore;

/**
 * Implémentation du service pour la gestion des utilisateurs.
 * Fournit des fonctionnalités pour la création, la recherche, l'authentification des utilisateurs,
 * ainsi que la récupération des utilisateurs associés à un projet.
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserStore userStore;

    @Autowired
    ProjectUserStore projectUserStore;

    /**
     * Récupère la liste de tous les utilisateurs enregistrés.
     * @return Une liste d'objets User.
     */
    @Override
    public List<User> findAll() {
        List<User> users = new ArrayList<User>();
        userStore.findAll().forEach(users::add);

        return users;
    }

    /**
     * Recherche un utilisateur par son identifiant unique.
     * @param id L'identifiant unique de l'utilisateur.
     * @return L'objet User correspondant.
     * @throws ValidationException si aucun utilisateur n'est trouvé avec l'ID spécifié.
     */
    @Override
    public User findById(Long id) {
        return userStore.findById(id)
            .orElseThrow(() -> new ValidationException("Utilisateur non trouvé avec l'ID: " + id));
    }

    /**
     * Crée un nouvel utilisateur.
     * Effectue une validation des champs obligatoires et vérifie l'unicité de l'email.
     * @param user L'objet User à créer.
     * @return L'objet User créé et sauvegardé.
     * @throws ValidationException si des champs obligatoires sont manquants, si le mot de passe est trop court,
     *                             ou si l'email est déjà utilisé.
     */
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

    /**
     * Authentifie un utilisateur en vérifiant son email et son mot de passe.
     * @param email L'adresse email de l'utilisateur.
     * @param password Le mot de passe de l'utilisateur.
     * @return L'objet User authentifié.
     * @throws AuthException si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect.
     */
    @Override
    public User login(String email, String password) {
        User user = userStore.findByEmail(email)
            .orElseThrow(() -> new AuthException("Utilisateur non trouvé avec cet email."));

        if (!user.getMdp().equals(password)) {
            throw new AuthException("Mot de passe incorrect.");
        }

        return user;
    }

    /**
     * Récupère tous les utilisateurs associés à un projet spécifique.
     * @param id L'identifiant unique du projet.
     * @return Une liste d'objets User associés au projet.
     */
    public List<User> findByProjectId(Long id) {
        List<User> users = new ArrayList<User>();
        List<ProjectUser> pUsers = projectUserStore.findByProjectId(id);

        for (ProjectUser projectUser : pUsers) {
            if (projectUser.getUser() != null) {
                userStore.findById(projectUser.getUser().getId()).ifPresent(users::add);
            }
        }

        return users;
    } 
}

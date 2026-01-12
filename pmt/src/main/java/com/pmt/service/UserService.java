package com.pmt.service;

import java.util.List;

import com.pmt.model.User;

/**
 * Interface de service pour la gestion des utilisateurs.
 */
public interface UserService {
    /**
     * Récupère tous les utilisateurs.
     *
     * @return Une liste de tous les utilisateurs.
     */
    List<User> findAll();
    /**
     * Récupère un utilisateur par son identifiant.
     *
     * @param id L'identifiant de l'utilisateur.
     * @return L'utilisateur correspondant à l'identifiant, ou null s'il n'existe pas.
     */
    User findById(Long id);
    /**
     * Crée un nouvel utilisateur.
     *
     * @param user L'utilisateur à créer.
     * @return L'utilisateur créé.
     */
    User create(User user);
    /**
     * Authentifie un utilisateur.
     *
     * @param email L'adresse email de l'utilisateur.
     * @param password Le mot de passe de l'utilisateur.
     * @return L'utilisateur authentifié, ou null si l'authentification échoue.
     */
    User login(String email, String password);
    /**
     * Récupère la liste des utilisateurs associés à un projet donné.
     *
     * @param id L'identifiant du projet.
     * @return Une liste d'objets User.
     */
    List<User> findByProjectId(Long id);
}
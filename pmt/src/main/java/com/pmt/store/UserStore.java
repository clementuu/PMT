package com.pmt.store;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.User;

/**
 * Interface de dépôt pour l'accès aux données des utilisateurs.
 */
public interface UserStore extends CrudRepository<User, Long> {
    /**
     * Récupère un utilisateur par son identifiant.
     *
     * @param id L'identifiant de l'utilisateur.
     * @return Un Optional contenant l'utilisateur s'il existe, ou un Optional vide.
     */
    Optional<User> findById(Long id);
    /**
     * Récupère un utilisateur par son adresse email.
     *
     * @param email L'adresse email de l'utilisateur.
     * @return Un Optional contenant l'utilisateur s'il existe, ou un Optional vide.
     */
    Optional<User> findByEmail(String email);
    /**
     * Vérifie si un utilisateur existe avec l'adresse email donnée.
     *
     * @param email L'adresse email à vérifier.
     * @return true si un utilisateur avec cette adresse email existe, false sinon.
     */
    boolean existsByEmail(String email);
}
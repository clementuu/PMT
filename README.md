# PMT - Project Management Tool

Outil de gestion de projet collaboratif destiné aux équipes de développement logiciel.

## Table des matières

- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Dépendances](#dépendances)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Commandes](#commandes)
- [Schéma base de données](#schéma-base-de-données)
- [API Endpoints](#api-endpoints)
  - [Authentification](#authentification)
  - [Projets](#projets)
  - [Tâches](#tâches)
  - [Utilisateurs](#utilisateurs)
  - [Historique](#historique)
- [Composants Frontend](#composants-frontend)
- [Démarrage rapide](#démarrage-rapide)
- [Déploiement](#déploiement)
- [Users stories](#users-stories)
- [Rapport de tests](#rapport-de-tests)
- [Evolutions possibles](#evolutions-possibles)
- [Repository](#repository)

---

## Architecture

- **Frontend**: Angular
- **Backend**: Java + Spring Boot
- **Base de données**: H2 (pour le développement)
- **Conteneurisation**: Docker

---

## Structure du projet

Le projet est divisé en deux modules principaux :

- `./ihm` : Contient l'application frontend développée avec Angular.
- `./pmt` : Contient l'application backend (API REST) développée avec Spring Boot.

---

## Dépendances

### Backend

- **JDK** v21+
- **mvn** v3.9+

### Frontend

- **Node.js** v22.18+
- **npm** v10.9+
- **Angular CLI** v20.3+

---

## Commandes

Un `Makefile` est disponible à la racine pour simplifier la gestion du projet.

| Commande        | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `make ihm`      | Lance le serveur de développement Angular.                                  |
| `make pmt`      | Lance l'API backend Spring Boot.                                            |
| `make test-ihm` | Exécute les tests unitaires du frontend et génère un rapport de couverture. |
| `make test-pmt` | Exécute les tests unitaires et d'intégration du backend.                    |
| `make build`    | Build des services conteneurisés avec Docker Compose.                       |
| `make start`    | Démarre les services conteneurisés avec Docker Compose.                     |
| `make stop`     | Eteint les services conteneurisés avec Docker Compose.                      |

---

## Schéma base de données

![Schéma des tables de la base de données](Database%20Diagram.jpg)

---

## API Endpoints

### Authentification

- `POST /user/login`: Connecte un utilisateur.

### Projets

- `GET /project`: Récupère tous les projets.
- `GET /project/{id}`: Récupère un projet par son ID.
- `POST /project`: Crée un nouveau projet.
- `PUT /project`: Met à jour un projet existant.
- `DELETE /project/{id}`: Supprime un projet.
- `GET /project/user/{userId}`: Récupère les projets d'un utilisateur.
- `POST /project/user`: Ajoute des utilisateurs à un projet.
- `GET /project/user/list/{projectId}`: Liste les utilisateurs d'un projet.
- `DELETE /project/user/{id}`: Retire un utilisateur d'un projet.

### Tâches

- `GET /task`: Récupère toutes les tâches.
- `GET /task/{id}`: Récupère une tâche par son ID.
- `POST /task`: Crée une nouvelle tâche.
- `PUT /task`: Met à jour une tâche existante.
- `DELETE /task/{id}`: Supprime une tâche.
- `POST /assign/{taskId}/{userId}`: Assigne une tâche à un utilisateur.
- `GET /assign/{taskId}`: Récupère les utilisateurs assignés à une tâche.
- `DELETE /assign/{id}`: Désassigne un utilisateur d'une tâche.

### Utilisateurs

- `GET /user`: Récupère tous les utilisateurs.
- `GET /user/{id}`: Récupère un utilisateur par son ID.
- `POST /user`: Crée un nouvel utilisateur.
- `GET /user/project/{id}`: Récupère les utilisateurs d'un projet.

### Historique

- `GET /historique/project/{id}`: Récupère l'historique d'un projet.
- `GET /historique/task/{id}`: Récupère l'historique d'une tâche.

---

## Composants Frontend

Liste des principaux composants Angular dans `ihm/src/app/components` :

- **dashboard**: Tableau de bord principal.
- **header**: En-tête de l'application.
- **historique**: Affiche l'historique des modifications.
- **home**: Page d'accueil.
- **login**: Formulaire de connexion.
- **not-found**: Page affichée pour les routes inexistantes.
- **project**: Vue détaillée d'un projet.
- **project-list**: Liste des projets.
- **project-new**: Formulaire de création de projet.
- **signin**: Formulaire d'inscription.
- **task**: Vue détaillée d'une tâche.
- **task-assign**: Composant pour assigner des tâches.
- **task-new**: Formulaire de création de tâche.
- **user-project**: Gestion des utilisateurs d'un projet.

---

## Démarrage rapide

1. **Cloner le dépôt**
2. **Lancer l'environnement avec Docker**

    ```sh
    make start
    ```

3. **Accéder à l'application**
    - Frontend: `http://localhost:4200`
    - Backend API Docs: `http://localhost:8080/swagger-ui.html`

---

## Déploiement

Le déploiement (push des images sur dockerhub) est automatisé via le pipeline CI/CD.

---

## Users stories

```text
    - En tant que visiteur, je veux pouvoir m'inscrire avec un nom d’utilisateur, une adresse email et un mot de passe afin d’avoir un compte sur la plateforme. 

    - En tant qu’inscrit, je veux pouvoir me connecter à la plateforme avec mon adresse e-mail et mon mot de passe afin de pouvoir accéder à mon espace. 

    - En tant qu'utilisateur, je veux pouvoir créer un nouveau projet avec un nom, une description et une date de début afin d’être un administrateur du projet. 

    - En tant qu'administrateur d’un projet, je veux pouvoir inviter d'autres membres à rejoindre mon projet en saisissant leur adresse e-mail afin de partager le projet. 

    - En tant qu’administrateur d’un projet, je veux pouvoir attribuer des rôles aux membres du projet (administrateur, membre, observateur) afin de définir leurs permissions. 
    
    - En tant qu'administrateur ou membre d’un projet, je veux pouvoir créer des tâches pour mon projet avec un nom, une description, une date d'échéance et une priorité. 
    
    - En tant qu'administrateur ou membre, je veux pouvoir assigner des tâches à des membres spécifiques du projet. 
    
    - En tant qu’administrateur ou membre, je veux pouvoir mettre à jour une tâche afin de changer n’importe quelle information ou ajouter une date de fin. 
    
    - En tant qu’administrateur, membre ou observateur, je veux pouvoir visualiser une tâche unitaire afin d’en voir toutes les informations.
    
    - En tant qu’administrateur, membre ou observateur, je veux pouvoir visualiser les tâches selon les statuts afin de suivre l'avancement des tâches sur un tableau de bord. 
    
    - En tant qu’administrateur, membre ou observateur, je veux pouvoir recevoir des notifications par e-mail lorsqu'une tâche est assignée. 
    
    - En tant qu’administrateur, membre ou observateur, je veux pouvoir suivre l'historique des modifications apportées aux tâches.
```

---

## Rapport de tests

- Rapport des tests front : `./ihm/coverage/ihm/index.html`
- Rapport des tests back : `./pmt/target/site/jacoco/index.html`

---

## Evolutions possibles

- Utiliser une vraie base MySQL containerisée pour la persistance des données
- Sécuriser le back
- Gestion de session via jwt

---

## Repository

<https://github.com/clementuu/PMT>

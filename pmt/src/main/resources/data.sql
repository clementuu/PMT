-- Utilisateurs
INSERT INTO user_app (id, nom, email, mdp) VALUES
(1, 'Alice Dupont', 'alice@example.com', 'pwd1'),
(2, 'Bob Martin', 'bob@example.com', 'pwd2');

-- Projets
INSERT INTO project (id, nom, description, date_fin) VALUES
(1, 'Site Web Vitrine', 'Création d’un site web vitrine pour une PME.', '2025-09-30'),
(2, 'Application Mobile', 'Développement d’une appli iOS/Android.', '2025-12-15');

-- Rôles dans les projets
INSERT INTO project_role (id, user_id, project_id, role) VALUES
(1, 1, 1, 0),
(2, 2, 1, 1),
(3, 2, 2, 2);

-- Tâches
INSERT INTO task (id, nom, description, date_echeance, date_fin, priorite, user_id, project_id) VALUES
(1, 'Design maquette', 'Réaliser les maquettes du site', '2025-08-01', '2025-08-03', 1, 1, 1),
(2, 'API backend', 'Développement de l’API REST', '2025-10-01', NULL, 2, 2, 2);

-- Assignations de tâches
INSERT INTO task_assign (id, user_id, task_id, project_id) VALUES
(1, 1, 1, 1),
(2, 2, 2, 2);

-- Utilisateurs
INSERT INTO user_app (nom, email, mdp) VALUES
('Alice Dupont', 'alice@example.com', 'pwd1'),
('Bob Martin', 'bob@example.com', 'pwd2');


-- Projets
INSERT INTO project (nom, description, date_fin) VALUES
('Site Web Vitrine', 'Création d’un site web vitrine pour une PME.', '2025-09-30'),
('Application Mobile', 'Développement d’une appli iOS/Android.', '2025-12-15');

-- Rôles dans les projets
INSERT INTO project_role (user_id, project_id, role) VALUES
(1, 1, 0),
(2, 1, 1),
(2, 2, 2);

-- Tâches
INSERT INTO task (nom, description, date_echeance, date_fin, priorite, status, user_id, project_id) VALUES
('Design maquette', 'Réaliser les maquettes du site', '2025-08-01', '2025-08-03', 1, 1, 1, 1),
('API backend', 'Développement de l’API REST', '2025-10-01', NULL, 2, 2, 2, 2);

-- Assignations de tâches
INSERT INTO task_assign (user_id, task_id, project_id) VALUES
(1, 1, 1),
(2, 2, 2);

-- Utilisateurs
INSERT INTO user_app (nom, email, mdp) VALUES
('Alice Dupont', 'alice@example.com', 'pwd1'),
('Bob Martin', 'bob@example.com', 'pwd2');


-- Projets
INSERT INTO project (nom, description, date_debut, date_fin) VALUES
('Site Web Vitrine', 'Création d’un site web vitrine pour une PME.', '2025-01-30', '2025-09-30'),
('Application Mobile', 'Développement d’une appli iOS/Android.', '2025-03-15', '2025-12-15');

-- Rôles dans les projets
INSERT INTO project_user (user_id, project_id, role) VALUES
(1, 1, 0),
(2, 1, 1),
(2, 2, 2);

-- Tâches
INSERT INTO task (nom, description, date_echeance, date_fin, priorite, status, project_id) VALUES
('Design maquette', 'Réaliser les maquettes du site', '2025-08-01', '2025-08-03', 1, 1, 1),
('API backend', 'Développement de l’API REST', '2025-10-01', NULL, 2, 2, 2);

-- Assignations de tâches
INSERT INTO task_assign (user_id, task_id) VALUES
(1, 1),
(2,1),
(2, 2);

INSERT INTO historique (user_id, task_id, project_id, date_m, type_m, new_string, old_string) VALUES
(1,1,NULL,'2025-09-05 17:43',1,'nouvelle description','ancienne description de la tache'),
(2,2,NULL,'2025-09-05 18:33',0,'Le forceur des abdos','Le seigneur des anneaux'),
(2,NULL,2,'2025-09-05 14:05',1,'première modif','texte original'),
(1,NULL,2,'2025-09-05 11:12',1,'deuxième modif','première modif'),
(2,NULL,1,'2025-09-05 09:54',1,'nouvelle','modification du titre');

CREATE TABLE user_app (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100),
    mdp VARCHAR(255)
);

CREATE TABLE project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    description TEXT,
    date_debut DATE,
    date_fin DATE
);

CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    description TEXT,
    date_echeance DATE,
    date_fin DATE,
    priorite INT,
    status INT,
    project_id INT,
    FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE project_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT,
    role INT,
    FOREIGN KEY (user_id) REFERENCES user_app(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE task_assign (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task_id INT,
    FOREIGN KEY (user_id) REFERENCES user_app(id),
    FOREIGN KEY (task_id) REFERENCES task(id)
);

CREATE TABLE historique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task_id INT DEFAULT NULL,
    project_id INT DEFAULT NULL,
    date_m DATETIME,
    type_m INT,
    new_string TEXT, 
    old_string TEXT,
    FOREIGN KEY (user_id) REFERENCES user_app(id)
);
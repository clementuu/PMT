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
    user_id INT,
    project_id INT,
    FOREIGN KEY (user_id) REFERENCES user_app(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE project_role (
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
    project_id INT,
    FOREIGN KEY (user_id) REFERENCES user_app(id),
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
);

# Utiliser une image Node.js pour le développement
FROM node:20 as build

WORKDIR /app

# Copier package.json et installer toutes les dépendances (y compris de développement)
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli

# Copier le reste du code de l'application
COPY . .

# Exposer le port par défaut d'Angular CLI
EXPOSE 4200

# Commande pour démarrer l'application en mode dev
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
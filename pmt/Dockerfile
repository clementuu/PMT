FROM maven:latest

WORKDIR /app

# Copier tout le code source et le pom, y compris .mvn, src/, pom.xml…
COPY pmt/ ./

# Exposer le port de l'API
EXPOSE 8080

# Télécharger les dépendances une fois pour toutes
RUN mvn dependency:go-offline -B

# Compiler et démarrer l'application à chaque lancement
CMD ["mvn", "spring-boot:run"]

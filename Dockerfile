# =====================
# Build stage
# =====================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first (cache dependencies)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# =====================
# Run stage
# =====================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/WebSockets2-0.0.1-SNAPSHOT.jar app.jar

# Expose Render port
EXPOSE 8080

# Run Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]

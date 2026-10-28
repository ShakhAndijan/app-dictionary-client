# syntax=docker/dockerfile:1

############################
#  Stage 1 — build the jar #
############################
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy sources. (A BuildKit cache mount keeps the local Maven repo warm across
# builds, so dependencies are only downloaded once.)
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp -DskipTests clean package

############################
#  Stage 2 — run the jar   #
############################
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Run as an unprivileged user.
RUN useradd -r -u 1001 appuser

# The Spring Boot executable (fat) jar built in stage 1.
COPY --from=build /app/target/dictionary-0.0.1-SNAPSHOT.jar app.jar

USER appuser
EXPOSE 8080

# JVM options can be supplied at runtime via JAVA_TOOL_OPTIONS (read automatically).
ENTRYPOINT ["java", "-jar", "app.jar"]

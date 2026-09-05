# ── Stage 1: Build ─────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Limit memory usage for Maven inside the build container to prevent OOM failures
ENV MAVEN_OPTS="-Xmx512m -XX:MaxMetaspaceSize=256m"

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src/ src/
RUN ./mvnw clean install -Dmaven.test.skip=true

# ── Stage 2: Run ───────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

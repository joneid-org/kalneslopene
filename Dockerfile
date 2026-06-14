FROM oven/bun:1 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bun run build

FROM eclipse-temurin:25-jdk-alpine AS backend-builder
WORKDIR /app
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN ./gradlew assemble --no-daemon

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

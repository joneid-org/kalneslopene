FROM oven/bun:1 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bun run build

FROM openjdk:24-rc-slim-bullseye AS backend-builder
WORKDIR /app
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN ./gradlew build -x test --no-daemon

FROM openjdk:24-rc-slim-bullseye
WORKDIR /app
COPY --from=backend-builder /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

FROM openjdk:21-rc-slim-bullseye AS builder
WORKDIR /app
COPY . .
RUN ./gradlew build -x test --no-daemon

FROM openjdk:21-rc-slim-bullseye
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar /app/app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

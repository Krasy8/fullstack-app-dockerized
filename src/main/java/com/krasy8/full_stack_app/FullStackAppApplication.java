package com.krasy8.full_stack_app;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Map;
import java.util.Set;

@SpringBootApplication
public class FullStackAppApplication {

	public static void main(String[] args) {
		// Load the .env file
		Dotenv dotenv = Dotenv.configure()
				.directory("/app/config/.env")
				.filename(".env")
				.load();

		// Set environment variables to Spring's System properties
		Set<DotenvEntry> envVars = dotenv.entries();
		envVars.forEach((entry) -> System.setProperty(entry.getKey(), entry.getValue()));

		// Run the Spring Boot app
		SpringApplication.run(FullStackAppApplication.class, args);
	}
}

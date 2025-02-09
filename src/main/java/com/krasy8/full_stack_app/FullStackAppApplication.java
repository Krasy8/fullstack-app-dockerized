package com.krasy8.full_stack_app;

import com.sun.tools.javac.Main;
import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Map;
import java.util.Set;

@SpringBootApplication
public class FullStackAppApplication {

	public static void main(String[] args) {

		final Logger log = LoggerFactory.getLogger(FullStackAppApplication.class);

		// Load the .env file
		Dotenv dotenv = Dotenv.configure()
				//local testing
//				.directory("/Users/Krasy8/Projects/config/springboot-react-fullstack-app/")
				//pushing to docker
				.directory("/app/config/")
				.filename(".env")
				.load();

		// Set environment variables to Spring's System properties
		Set<DotenvEntry> envVars = dotenv.entries();
		envVars.forEach((entry) -> System.setProperty(entry.getKey(), entry.getValue()));

		log.info("env vars: {}, system properties: {}", envVars, System.getProperties());

		// Run the Spring Boot app
		SpringApplication.run(FullStackAppApplication.class, args);
	}
}

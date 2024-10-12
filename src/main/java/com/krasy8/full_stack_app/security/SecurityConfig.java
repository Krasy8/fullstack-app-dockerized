package com.krasy8.full_stack_app.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private AdminUserDetailsService adminUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // CORS Configuration
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOrigin("http://localhost:3000");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.addExposedHeader("Authorization");
        corsConfig.addExposedHeader("X-XSRF-TOKEN");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        http
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // or .IF_REQUIRED, .NEVER, etc.
                )
                .cors(c -> c.configurationSource(source))
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/v1/admin/**")
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())) // Use Cookie based CSRF
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers("/api/v1/admin/**").permitAll() //
                                .requestMatchers("/api/v1/students/**").authenticated() // Protect student-related endpoints
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/auth").permitAll()
                                .requestMatchers(HttpMethod.POST, "/**").permitAll()
                )
                .formLogin(form -> form
                        .loginPage("/auth") // Set login form page
                        .defaultSuccessUrl("/", true) // Redirect after successful login
                        .permitAll() // Allow everyone to access login page
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/auth?logout") // Redirect after logout
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Use BCrypt for hashing passwords
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.userDetailsService(adminUserDetailsService).passwordEncoder(passwordEncoder());
        return authManagerBuilder.build();
    }
}

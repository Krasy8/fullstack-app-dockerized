package com.krasy8.full_stack_app.security;

import com.krasy8.full_stack_app.security.jwt.JwtAuthorizationFilter;
import com.krasy8.full_stack_app.security.jwt.JwtUtil;
import com.krasy8.full_stack_app.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordConfig passwordConfig;
    @Autowired
    private JwtUtil jwtUtil;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // CORS Configuration
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOrigin("http://localhost:3000/");
//        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-XSRF-TOKEN"));
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.addExposedHeader("Authorization");
//        corsConfig.addExposedHeader("X-XSRF-TOKEN");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        http
                .cors(c -> c.configurationSource(source))
                .csrf(AbstractHttpConfigurer::disable
//                        .ignoringRequestMatchers("/api/v1/admin/**")
//                        .ignoringRequestMatchers("/api/v1/csrf/**")
//                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                        .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())) // Use Cookie based CSRF
//                .addFilterAfter(new CsrfCookieFilter(), UsernamePasswordAuthenticationFilter.class)
//                .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
                )
                .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers("/authenticating").permitAll()
                                .requestMatchers("/api/v1/admin/**").permitAll() //
                                .requestMatchers("/api/v1/csrf/**").permitAll()
                                .requestMatchers("/api/v1/students/**").hasRole(Role.MASTER.name())
                )
                .addFilter(new JwtAuthorizationFilter(authManager(http), jwtUtil))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder.userDetailsService(userService).passwordEncoder(passwordConfig.passwordEncoder());
        return authManagerBuilder.build();
    }
}

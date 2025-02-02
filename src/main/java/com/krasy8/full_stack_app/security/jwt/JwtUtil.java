package com.krasy8.full_stack_app.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final String secretKey = System.getProperty("JWT_SECRET");
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    private final Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

    // Generate the JWT token with authorities included
    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .setSubject(authentication.getName()) // Username
                .claim("authorities", authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority) // Extract authorities as a list of strings
                        .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract the username (subject) from the token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Extract authorities from the token
    public List<GrantedAuthority> extractAuthorities(String token) {
        Claims claims = extractClaims(token);
        List<String> authorities = claims.get("authorities", List.class);
        // Map each string authority to a SimpleGrantedAuthority
        return authorities.stream()
                .map(SimpleGrantedAuthority::new) // Create SimpleGrantedAuthority from String
                .collect(Collectors.toList());
    }

    // Extract the claims from the token
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Validate the JWT token (check if it's expired or invalid)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}

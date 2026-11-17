package com.krishna.devhire_ai.config;

import com.krishna.devhire_ai.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,
                                "/users",
                                "/users/login",
                                "/profiles",
                                "/resumes/upload",
                                "/resumes/analyze",
                                "/career/recommend",
                                "/applications"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/resumes/**", "/jobs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/applications/**", "/recruiter/**").hasRole("RECRUITER")
                        .requestMatchers(HttpMethod.PUT, "/applications/**").hasRole("RECRUITER")
                        .requestMatchers(HttpMethod.POST, "/jobs").hasRole("RECRUITER")
                        .requestMatchers(HttpMethod.GET, "/candidate/**").hasRole("USER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
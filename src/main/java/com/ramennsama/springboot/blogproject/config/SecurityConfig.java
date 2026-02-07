package com.ramennsama.springboot.blogproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ramennsama.springboot.blogproject.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // ===== FRONTEND (PUBLIC) =====
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/favicon.ico",
                                "/assets/**",
                                "/static/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/*.html")
                        .permitAll()

                        // ===== AUTH =====
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()

                        // ===== PUBLIC API =====
                        .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tags", "/api/tags/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/{userId}").permitAll()

                        // ===== SWAGGER =====
                        .requestMatchers(
                                "/docs",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**")
                        .permitAll()

                        // ===== ADMIN =====
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/posts/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/posts/*/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/posts/*/unpublish").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/tags/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tags/**").hasRole("ADMIN")

                        // ===== AUTHENTICATED =====
                        .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/posts/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/posts/*/like", "/api/posts/*/dislike").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/posts/*/comments").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/posts/*/comments/**").authenticated()
                        .requestMatchers("/api/auth/info").authenticated()
                        .requestMatchers("/api/users/**").authenticated()

                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint()))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * ===================== SECURITY SUPPORT BEANS =====================
     * Common beans used by Spring Security (PasswordEncoder, AuthManager, ...)
     */
    // ham nay dc goi ngay ben tren:V
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");

            response.setHeader("WWW-Authenticate", "");
            response.getWriter().write("""
                    {
                        "status": 401,
                        "error": "Unauthorized",
                        "message": "JWT expired or invalid"
                    } """);
        };
    }

    // use, when authenticationManager.authenticate(...):D
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

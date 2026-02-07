package com.ramennsama.springboot.blogproject.config;

import java.io.IOException;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ramennsama.springboot.blogproject.config.jwtservice.JwtService;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private JwtService jwtService;
    private UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService,
                         @Lazy UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }



    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip JWT filter for public endpoints
        return path.startsWith("/api/auth/") ||
               path.equals("/api/auth/register") ||
               path.equals("/api/auth/login") ||
               // Public GET endpoints
               (method.equals("GET") && path.startsWith("/api/posts")) ||
               (method.equals("GET") && path.startsWith("/api/tags")) ||
               (method.equals("GET") && path.matches("/api/users/\\d+")) ||
               // Documentation
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/docs") ||
               path.startsWith("/actuator") ||
               // Frontend files - ALL HTML, CSS, JS, images
               path.equals("/") ||
               path.equals("/index.html") ||
               path.equals("/login.html") ||
               path.equals("/register.html") ||
               path.startsWith("/static") ||
               path.startsWith("/css") ||
               path.startsWith("/js") ||
               path.startsWith("/images") ||
               path.startsWith("/assets") ||
               path.endsWith(".html") ||
               path.endsWith(".css") ||
               path.endsWith(".js") ||
               path.endsWith(".ico") ||
               path.endsWith(".png") ||
               path.endsWith(".jpg") ||
               path.endsWith(".svg") ||
               path.endsWith(".woff") ||
               path.endsWith(".woff2") ||
               path.endsWith(".ttf");
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            username = jwtService.extractUsername(jwt);
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT expired"); // throw exception
            return;
        }

        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
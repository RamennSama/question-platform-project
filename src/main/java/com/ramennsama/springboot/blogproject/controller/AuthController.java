package com.ramennsama.springboot.blogproject.controller;

import com.ramennsama.springboot.blogproject.dto.request.LoginRequest;
import com.ramennsama.springboot.blogproject.dto.request.RegisterRequest;
import com.ramennsama.springboot.blogproject.dto.response.JwtResponse;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.config.jwtservice.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(
        name = "Authentication REST API Endpoints",
        description = "Operations related to register & login"
)
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a user", description = "Create new user in database")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) throws Exception {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
        //return new ResponseEntity<>(request, HttpStatus.OK);
    }

    @Operation(summary = "Login a user", description = "submit email & password to authenticate user")
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        JwtResponse jwt = authService.login(request);
        return ResponseEntity.ok(jwt);
    }

    // test
    @Operation(summary = "Get Info a user", description = "Get info authenticated user")
    @GetMapping("/info")
    public ResponseEntity<UserResponse> getInfo() {
        return ResponseEntity.ok(this.authService.getInfo());
    }
}
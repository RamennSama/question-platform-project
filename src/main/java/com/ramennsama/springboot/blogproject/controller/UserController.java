package com.ramennsama.springboot.blogproject.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ramennsama.springboot.blogproject.dto.request.AvatarUpdateRequest;
import com.ramennsama.springboot.blogproject.dto.request.PasswordUpdateRequest;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name="User REST API Endpoints", description = "Operations related to info about current user")
@RequestMapping("/api/users")
@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;

    @Operation(summary = "User information", description = "Get current user info")
    @GetMapping("/info")
    public ResponseEntity<UserResponse> getUserInfo() {
        return ResponseEntity.ok(userService.getUserInfo());
    }
    
    @Operation(summary = "Get user by ID", description = "Get public user profile by ID")
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

//    @Operation(summary = "Delete user", description = "Delete current user account")
//    @DeleteMapping
//    public ResponseEntity<Void> deleteUser() {
//        userService.deleteUser();
//        return ResponseEntity.ok().build();
//    }

    @Operation(summary = "Password update", description = "Change user password after verification")
    @PutMapping("/password")
    public ResponseEntity<Void> passwordUpdate(@Valid @RequestBody PasswordUpdateRequest rq) {
        userService.updatePassword(rq);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "Update avatar", description = "Update user avatar URL")
    @PutMapping("/avatar")
    public ResponseEntity<UserResponse> updateAvatar(@RequestBody AvatarUpdateRequest request) {
        UserResponse response = userService.updateAvatar(request.getAvatarUrl());
        return ResponseEntity.ok(response);
    }

}

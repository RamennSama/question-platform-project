package com.ramennsama.springboot.blogproject.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ramennsama.springboot.blogproject.dto.response.CommentResponse;
import com.ramennsama.springboot.blogproject.dto.response.DashboardStats;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.entity.Comment;
import com.ramennsama.springboot.blogproject.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@Tag(name = "Admin REST API Endpoints", description = "Operations related to a admin")
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@RestController
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Get dashboard statistics", description = "Retrieve statistics for admin dashboard")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = this.adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Get all users", description = "Retrieve a list of all users in the system")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = this.adminService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
        // return ResponseEntity.ok(todos); : also
    }

    @Operation(summary = "Promote user to admin", description = "Promote user to admin role")
    @PutMapping("/{userId}/role")
    public ResponseEntity<Void> assignAdmin(@PathVariable @Min(1) long userId) {
        this.adminService.assignAdmin(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Operation(summary = "Delete user", description = "Delete a non-admin user from the system")
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable @Min(1) long userId) {
        this.adminService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get all comments", description = "Retrieve all comments in the system")
    @GetMapping("/comments")
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        List<Comment> comments = this.adminService.getAllComments();
        List<CommentResponse> response = comments.stream()
            .map(c -> {
                String authorName = c.getUser().getFirstName() + " " + c.getUser().getLastName();
                return new CommentResponse(
                    c.getId(),
                    c.getContent(),
                    authorName,
                    c.getUser().getId(),
                    c.getCreateAt(),
                    c.getPost().getSlug(),
                    c.getPost().getTitle()
                );
            })
            .toList();
        return ResponseEntity.ok(response);
    }
}

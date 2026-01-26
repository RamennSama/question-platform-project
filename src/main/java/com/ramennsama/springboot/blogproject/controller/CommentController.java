package com.ramennsama.springboot.blogproject.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ramennsama.springboot.blogproject.dto.request.CommentRequest;
import com.ramennsama.springboot.blogproject.dto.response.CommentResponse;
import com.ramennsama.springboot.blogproject.entity.Comment;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.service.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts/{slug}/comments")
@RequiredArgsConstructor
@Tag(name = "Comment API", description = "Comment controller")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create comment")
    public ResponseEntity<CommentResponse> create(
            @PathVariable String slug,
            @RequestBody CommentRequest request,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();
        Comment comment = commentService.createComment(slug, request.getContent(), user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(comment));
    }

    @GetMapping
    @Operation(summary = "Get comments by post")
    public ResponseEntity<List<CommentResponse>> getAll(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(
                commentService.getCommentsByPost(slug)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete comment")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();
        commentService.deleteComment(id, user);
        return ResponseEntity.noContent().build();
    }

    /**
     * ======================== INTERNAL HELPERS ========================
     */

    private CommentResponse toResponse(Comment c) {
        String authorName = c.getUser().getFirstName() + " " + c.getUser().getLastName();
        return new CommentResponse(
                c.getId(),
                c.getContent(),
                authorName,
                c.getUser().getId(),
                c.getCreateAt()
        );
    }
}

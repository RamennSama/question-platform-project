package com.ramennsama.springboot.blogproject.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ramennsama.springboot.blogproject.dto.request.PostRequest;
import com.ramennsama.springboot.blogproject.dto.response.PostResponse;
import com.ramennsama.springboot.blogproject.entity.Post;
import com.ramennsama.springboot.blogproject.entity.Tag;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.service.PostService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Post REST API Endpoints", description = "Post controller")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new post", description = "Create a new blog post for the authenticated user")
    public ResponseEntity<PostResponse> createPost(
            @RequestBody PostRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        Post post = postService.createPost(request, email);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toResponse(post));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get post by slug", description = "Get post details using its slug (public access)")
    public ResponseEntity<PostResponse> getPost(@PathVariable String slug) {
        postService.incrementViews(slug);
        Post post = postService.getBySlug(slug);
        return ResponseEntity.ok(toResponse(post));
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get posts by user", description = "Get all published posts by a specific user")
    public ResponseEntity<Page<PostResponse>> getPostsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Post> posts = postService.getPostsByUser(userId, page, size);
        return ResponseEntity.ok(posts.map(this::toResponse));
    }

    @PostMapping("/{slug}/like")
    @Operation(summary = "Like a post", description = "Toggle like for a post. If already liked, remove like. If disliked, switch to like.")
    public ResponseEntity<PostResponse> likePost(@PathVariable String slug, Principal principal) {
        postService.likePost(slug, principal.getName());
        Post post = postService.getBySlug(slug);
        return ResponseEntity.ok(toResponse(post));
    }

    @PostMapping("/{slug}/dislike")
    @Operation(summary = "Dislike a post", description = "Toggle dislike for a post. If already disliked, remove dislike. If liked, switch to dislike.")
    public ResponseEntity<PostResponse> dislikePost(@PathVariable String slug, Principal principal) {
        postService.dislikePost(slug, principal.getName());
        Post post = postService.getBySlug(slug);
        return ResponseEntity.ok(toResponse(post));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete post", description = "Delete a post. Only the author or an admin can delete the post")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        postService.deletePost(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "get all posts", description = "get all published posts")
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createAt") String sort
    ) {
        Page<Post> posts = postService.getAllPosts(page, size, sort);

        Page<PostResponse> response = posts.map(this::toResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "get all posts for admin", description = "get all posts including drafts (admin only)")
    public ResponseEntity<Page<PostResponse>> getAllPostsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(defaultValue = "createAt") String sort
    ) {
        Page<Post> posts = postService.getAllPostsForAdmin(page, size, sort);

        Page<PostResponse> response = posts.map(this::toResponse);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve post", description = "Admin approves a post to publish it")
    public ResponseEntity<PostResponse> approvePost(@PathVariable Long id) {
        Post post = postService.togglePublishStatus(id, true);
        return ResponseEntity.ok(toResponse(post));
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Unpublish post", description = "Admin unpublishes a post")
    public ResponseEntity<PostResponse> unpublishPost(@PathVariable Long id) {
        Post post = postService.togglePublishStatus(id, false);
        return ResponseEntity.ok(toResponse(post));
    }

    /**
     * ======================== INTERNAL HELPERS ========================
     */

    private PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getSlug(),
                post.isPublished(),
                post.getAuthor().getId(),
                post.getAuthor().getEmail(),
                post.getTags().stream().map(Tag::getName).toList(),
                post.getCreateAt(),
                post.getUpdateAt(),
                post.getLikesCount(),
                post.getDislikesCount(),
                post.getViewsCount()
        );
    }

    @GetMapping("/stats/public")
    public ResponseEntity<Map<String, Long>> getPublicStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPosts", postService.getTotalPostsCount());
        stats.put("totalUsers", postService.getTotalUsersCount());
        stats.put("totalComments", postService.getTotalCommentsCount());
        return ResponseEntity.ok(stats);
    }
}

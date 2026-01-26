package com.ramennsama.springboot.blogproject.controller;


import com.ramennsama.springboot.blogproject.dto.response.TagResponse;
import com.ramennsama.springboot.blogproject.entity.Tag;
import com.ramennsama.springboot.blogproject.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Tag REST API Endpoints", description = "Tag controller")
@RequiredArgsConstructor
@RequestMapping("/api/tags")
@RestController
public class TagController {

    private final TagService tagService;

    @Operation(summary = "Get all tags", description = "Get all tags in database")
    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @Operation(summary = "Create tag", description = "Create a new tag")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestParam String name) {
        Tag tag = tagService.createTag(name);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TagResponse(tag.getId(), tag.getName()));
    }

    @Operation(summary = "Delete tag", description = "Delete tag by id")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}

package com.ramennsama.springboot.blogproject.service;


import org.springframework.data.domain.Page;

import com.ramennsama.springboot.blogproject.dto.request.PostRequest;
import com.ramennsama.springboot.blogproject.entity.Post;
import com.ramennsama.springboot.blogproject.entity.User;

public interface PostService {
    Post createPost(PostRequest post, String userEmail);
    Post getBySlug(String slug);
    void deletePost(Long postId, User currentUser);
    Page<Post> getAllPosts(int page, int size, String sortBy);
    Page<Post> getAllPostsForAdmin(int page, int size, String sortBy);
    void incrementViews(String slug);
    void likePost(String slug, String userEmail);
    void dislikePost(String slug, String userEmail);
    Post togglePublishStatus(Long postId, boolean published);
    
    Page<Post> getPostsByUser(Long userId, int page, int size);
    
    // Stats methods
    long getTotalPostsCount();
    long getTotalUsersCount();
    long getTotalCommentsCount();
}

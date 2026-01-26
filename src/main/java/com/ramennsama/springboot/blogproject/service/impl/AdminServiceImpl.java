package com.ramennsama.springboot.blogproject.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ramennsama.springboot.blogproject.dto.response.DashboardStats;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.entity.Authority;
import com.ramennsama.springboot.blogproject.entity.Comment;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.repository.CommentRepository;
import com.ramennsama.springboot.blogproject.repository.PostRepository;
import com.ramennsama.springboot.blogproject.repository.TagRepository;
import com.ramennsama.springboot.blogproject.repository.UserRepository;
import com.ramennsama.springboot.blogproject.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;

    @Override
    public DashboardStats getDashboardStats() {
        Long totalPosts = postRepository.count();
        Long totalUsers = userRepository.count();
        Long totalComments = commentRepository.count();
        Long totalTags = tagRepository.count();
        
        Long publishedPosts = postRepository.countByPublished(true);
        Long draftPosts = postRepository.countByPublished(false);
        
        // Calculate total views, likes, dislikes
        Long totalViews = postRepository.sumAllViews();
        Long totalLikes = postRepository.sumAllLikes();
        Long totalDislikes = postRepository.sumAllDislikes();
        
        return new DashboardStats(
            totalPosts,
            totalUsers,
            totalComments,
            totalTags,
            publishedPosts,
            draftPosts,
            totalViews != null ? totalViews : 0L,
            totalLikes != null ? totalLikes : 0L,
            totalDislikes != null ? totalDislikes : 0L
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToUserResponse)
                .toList();
    }

    @Override
    public UserResponse assignAdmin(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "User does not exist"));

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));

        if (isAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User is already an admin");
        }

        List<Authority> authorities = new ArrayList<>();
        authorities.add(new Authority("ROLE_USER"));
        authorities.add(new Authority("ROLE_ADMIN"));
        user.setAuthorities(authorities);

        User promotedUser = userRepository.save(user);
        return convertToUserResponse(promotedUser);
    }

    @Override
    public void deleteUser(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "User does not exist"));

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));

        if (isAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User does not exist or already an admin");
        }

        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getAllComments() {
        return commentRepository.findAllWithPostAndUser();
    }

    /**
     * ======================== INTERNAL HELPERS ========================
     */

    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getAuthorities().stream().map(auth -> (Authority) auth).toList(),
                user.getCreateAt(),
                user.getAvatarUrl());
    }
}

package com.ramennsama.springboot.blogproject.service;

import java.util.List;

import com.ramennsama.springboot.blogproject.dto.response.DashboardStats;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.entity.Comment;

public interface AdminService {
    DashboardStats getDashboardStats();
    List<UserResponse> getAllUsers();
    UserResponse assignAdmin(long userId);
    void deleteUser(long userId);
    List<Comment> getAllComments();
}

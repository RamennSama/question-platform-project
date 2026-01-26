package com.ramennsama.springboot.blogproject.service;

import com.ramennsama.springboot.blogproject.dto.request.PasswordUpdateRequest;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;

public interface UserService {
    UserResponse getUserInfo();
    UserResponse getUserById(Long userId);
    void deleteUser();
    void updatePassword(PasswordUpdateRequest rq);
    UserResponse updateAvatar(String avatarUrl);
}

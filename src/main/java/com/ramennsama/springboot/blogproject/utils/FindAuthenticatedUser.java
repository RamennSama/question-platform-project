package com.ramennsama.springboot.blogproject.utils;


import com.ramennsama.springboot.blogproject.entity.User;

public interface FindAuthenticatedUser {
    User getAuthenticatedUser();
}

package com.ramennsama.springboot.blogproject.service;

import com.ramennsama.springboot.blogproject.entity.Comment;
import com.ramennsama.springboot.blogproject.entity.User;

import java.util.List;

public interface CommentService {
    Comment createComment(String slug, String content, User user);
    List<Comment> getCommentsByPost(String slug);
    void deleteComment(Long id, User user);
}

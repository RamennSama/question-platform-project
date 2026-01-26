package com.ramennsama.springboot.blogproject.service.impl;

import com.ramennsama.springboot.blogproject.entity.Comment;
import com.ramennsama.springboot.blogproject.entity.Post;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.repository.CommentRepository;
import com.ramennsama.springboot.blogproject.repository.PostRepository;
import com.ramennsama.springboot.blogproject.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    public Comment createComment(String slug, String content, User user) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Comment> getCommentsByPost(String slug) {
        return commentRepository.findByPostSlug(slug);
    }

    @Override
    public void deleteComment(Long id, User user) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // OWNER hoặc ADMIN
        if (!comment.getUser().getId().equals(user.getId())
                && user.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("Not allowed");
        }

        commentRepository.delete(comment);
    }
}

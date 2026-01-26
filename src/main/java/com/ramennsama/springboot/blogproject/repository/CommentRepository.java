package com.ramennsama.springboot.blogproject.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ramennsama.springboot.blogproject.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("""
        SELECT c FROM Comment c
        JOIN FETCH c.user
        WHERE c.post.slug = :slug
        ORDER BY c.createAt DESC
    """)
    List<Comment> findByPostSlug(String slug);

    @Query("""
        SELECT c FROM Comment c
        JOIN FETCH c.user
        JOIN FETCH c.post
        ORDER BY c.createAt DESC
    """)
    List<Comment> findAllWithPostAndUser();
}

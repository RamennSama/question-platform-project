package com.ramennsama.springboot.blogproject.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ramennsama.springboot.blogproject.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // join fetch author and tags to avoid LazyInitializationException
    @Query("""
    SELECT DISTINCT p FROM Post p
    LEFT JOIN FETCH p.author
    LEFT JOIN FETCH p.tags
    WHERE p.slug = :slug """)
    Optional<Post> findBySlug(String slug);

    @Query("""
    SELECT DISTINCT p FROM Post p
    LEFT JOIN FETCH p.author
    LEFT JOIN FETCH p.tags
    WHERE p.id = :id """)
    Optional<Post> findByIdWithAuthor(Long id);

    @Query("""
        SELECT DISTINCT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.tags
        WHERE p.published = true
    """)
    Page<Post> findAllWithAuthorAndTags(Pageable pageable);
    
    @Query("""
        SELECT DISTINCT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.tags
    """)
    Page<Post> findAllWithAuthorAndTagsForAdmin(Pageable pageable);
    
    @Query("""
        SELECT DISTINCT p FROM Post p
        LEFT JOIN FETCH p.author
        LEFT JOIN FETCH p.tags
        WHERE p.author.id = :authorId AND p.published = true
    """)
    Page<Post> findByAuthorId(Long authorId, Pageable pageable);
    
    // Statistics queries
    Long countByPublished(boolean published);
    
    @Query("SELECT SUM(p.viewsCount) FROM Post p")
    Long sumAllViews();
    
    @Query("SELECT SUM(p.likesCount) FROM Post p")
    Long sumAllLikes();
    
    @Query("SELECT SUM(p.dislikesCount) FROM Post p")
    Long sumAllDislikes();
    
    @Query("SELECT COUNT(DISTINCT p.author.id) FROM Post p")
    long countDistinctAuthors();
}

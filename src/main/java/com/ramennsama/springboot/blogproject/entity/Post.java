package com.ramennsama.springboot.blogproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, unique = true)
    private String slug;

    private boolean published;

    // Statistics
    @Column(name = "likes_count", columnDefinition = "INTEGER DEFAULT 0")
    private Integer likesCount = 0;

    @Column(name = "dislikes_count", columnDefinition = "INTEGER DEFAULT 0")
    private Integer dislikesCount = 0;

    @Column(name = "views_count", columnDefinition = "INTEGER DEFAULT 0")
    private Integer viewsCount = 0;

    // AUTHOR
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    // TAGS
    @ManyToMany
    @JoinTable(
            name = "post_tags",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    // USER INTERACTIONS - Danh sách user đã like/dislike
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "post_likes", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<Long> likedByUsers = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "post_dislikes", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<Long> dislikedByUsers = new HashSet<>();

    @CreationTimestamp
    @Column(name = "create_at", updatable = false)
    private Date createAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    private Date updateAt;
}
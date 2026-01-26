package com.ramennsama.springboot.blogproject.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private String author;
    private Long userId;
    private Date createAt;
    private String postSlug;
    private String postTitle;
    
    // Constructor cho comment thường (không có post info)
    public CommentResponse(Long id, String content, String author, Long userId, Date createAt) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.userId = userId;
        this.createAt = createAt;
    }
}

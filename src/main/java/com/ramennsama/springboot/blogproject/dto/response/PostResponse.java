package com.ramennsama.springboot.blogproject.dto.response;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String slug;
    private boolean published;
    private Long authorId;
    private String authorEmail;
    private List<String> tags;
    private Date createAt;
    private Date updateAt;
    private Integer likesCount;
    private Integer dislikesCount;
    private Integer viewsCount;
}

package com.ramennsama.springboot.blogproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private Long totalPosts;
    private Long totalUsers;
    private Long totalComments;
    private Long totalTags;
    private Long publishedPosts;
    private Long draftPosts;
    private Long totalViews;
    private Long totalLikes;
    private Long totalDislikes;
}

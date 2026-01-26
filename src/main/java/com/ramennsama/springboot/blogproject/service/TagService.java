package com.ramennsama.springboot.blogproject.service;


import com.ramennsama.springboot.blogproject.dto.response.TagResponse;
import com.ramennsama.springboot.blogproject.entity.Tag;

import java.util.List;

public interface TagService {
    List<TagResponse> getAllTags();
    Tag createTag(String name);
    void deleteTag(Long id);
}

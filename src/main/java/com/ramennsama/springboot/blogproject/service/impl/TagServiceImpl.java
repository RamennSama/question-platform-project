package com.ramennsama.springboot.blogproject.service.impl;

import com.ramennsama.springboot.blogproject.dto.response.TagResponse;
import com.ramennsama.springboot.blogproject.entity.Tag;
import com.ramennsama.springboot.blogproject.repository.TagRepository;
import com.ramennsama.springboot.blogproject.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(this::convertToTagResponse)
                .toList();
    }

    @Override
    public Tag createTag(String name) {
        if (tagRepository.existsByName(name)) {
            throw new IllegalArgumentException("Tag already exists");
        }

        Tag tag = new Tag();
        tag.setName(name);

        return tagRepository.save(tag);
    }


    @Override
    public void deleteTag(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new IllegalArgumentException("Tag not found");
        }

        tagRepository.deleteById(id);
    }

    // ==============

    private TagResponse convertToTagResponse(Tag tag) {
        return new TagResponse(
                tag.getId(),
                tag.getName()
        );
    }
}

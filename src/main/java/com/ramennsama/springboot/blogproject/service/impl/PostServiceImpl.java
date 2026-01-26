package com.ramennsama.springboot.blogproject.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ramennsama.springboot.blogproject.dto.request.PostRequest;
import com.ramennsama.springboot.blogproject.entity.Post;
import com.ramennsama.springboot.blogproject.entity.Tag;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.repository.CommentRepository;
import com.ramennsama.springboot.blogproject.repository.PostRepository;
import com.ramennsama.springboot.blogproject.repository.TagRepository;
import com.ramennsama.springboot.blogproject.repository.UserRepository;
import com.ramennsama.springboot.blogproject.service.PostService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Override
    public Post createPost(PostRequest request, String userEmail) {
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Handle tags - can be null or empty
        List<Tag> tags = List.of();
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            tags = tagRepository.findAllById(request.getTagIds());
        }

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setPublished(request.getPublished() != null ? request.getPublished() : true);
        post.setAuthor(author);
        post.setTags(tags);
        post.setSlug(generateUniqueSlug(request.getTitle()));

        return postRepository.save(post);
    }

    @Override
    public Post getBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public void incrementViews(String slug) {
        Post post = getBySlug(slug);
        post.setViewsCount(post.getViewsCount() + 1);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void likePost(String slug, String userEmail) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        boolean wasLiked = post.getLikedByUsers().contains(userId);
        boolean wasDisliked = post.getDislikedByUsers().contains(userId);

        if (wasLiked) {
            // Đã like rồi → Bỏ like
            post.getLikedByUsers().remove(userId);
            post.setLikesCount(post.getLikesCount() - 1);
        } else if (wasDisliked) {
            // Đang dislike → Chuyển sang like
            post.getDislikedByUsers().remove(userId);
            post.getLikedByUsers().add(userId);
            post.setDislikesCount(post.getDislikesCount() - 1);
            post.setLikesCount(post.getLikesCount() + 1);
        } else {
            // Chưa tương tác → Tạo mới like
            post.getLikedByUsers().add(userId);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        postRepository.save(post);
    }

    @Override
    @Transactional
    public void dislikePost(String slug, String userEmail) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();
        boolean wasLiked = post.getLikedByUsers().contains(userId);
        boolean wasDisliked = post.getDislikedByUsers().contains(userId);

        if (wasDisliked) {
            // Đã dislike rồi → Bỏ dislike
            post.getDislikedByUsers().remove(userId);
            post.setDislikesCount(post.getDislikesCount() - 1);
        } else if (wasLiked) {
            // Đang like → Chuyển sang dislike
            post.getLikedByUsers().remove(userId);
            post.getDislikedByUsers().add(userId);
            post.setLikesCount(post.getLikesCount() - 1);
            post.setDislikesCount(post.getDislikesCount() + 1);
        } else {
            // Chưa tương tác → Tạo mới dislike
            post.getDislikedByUsers().add(userId);
            post.setDislikesCount(post.getDislikesCount() + 1);
        }

        postRepository.save(post);
    }

    @Override
    public void deletePost(Long postId, User currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean isAuthor = post.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getAuthorities()
                .stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("You are not authorized or admin to delete this post");
        }

        postRepository.delete(post);
    }

    @Override
    public Page<Post> getAllPosts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );
        return postRepository.findAllWithAuthorAndTags(pageable);
    }

    @Override
    public Page<Post> getAllPostsForAdmin(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );
        return postRepository.findAllWithAuthorAndTagsForAdmin(pageable);
    }

    @Override
    @Transactional
    public Post togglePublishStatus(Long postId, boolean published) {
        Post post = postRepository.findByIdWithAuthor(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setPublished(published);
        return postRepository.save(post);
    }
    
    @Override
    public Page<Post> getPostsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending());
        return postRepository.findByAuthorId(userId, pageable);
    }

    /**
     * ======================== INTERNAL HELPERS ========================
     */

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private String generateUniqueSlug(String title) {
        String baseSlug = generateSlug(title);
        String slug = baseSlug;
        int counter = 1;

        // Kiểm tra xem slug đã tồn tại chưa
        while (postRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter;
            counter++;
        }

        return slug;
    }


    @Override
    public long getTotalPostsCount() {
        return postRepository.count();
    }

    @Override
    public long getTotalUsersCount() {
        return postRepository.countDistinctAuthors();
    }

    @Override
    public long getTotalCommentsCount() {
        return commentRepository.count();
    }
}

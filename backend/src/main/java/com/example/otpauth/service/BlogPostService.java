package com.example.otpauth.service;

import com.example.otpauth.model.BlogPost;
import com.example.otpauth.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogPostService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    public List<BlogPost> getAllBlogPosts() {
        return blogPostRepository.findAll();
    }

    public List<BlogPost> getBlogPostsByCompanyId(Long companyId) {
        return blogPostRepository.findByCompanyId(companyId);
    }

    public Optional<BlogPost> getBlogPostById(Long id) {
        return blogPostRepository.findById(id);
    }

    public BlogPost saveBlogPost(BlogPost blogPost) {
        return blogPostRepository.save(blogPost);
    }

    public BlogPost updateBlogPost(Long id, BlogPost updatedPost) {
        return blogPostRepository.findById(id).map(existing -> {
            existing.setTitle(updatedPost.getTitle());
            existing.setContent(updatedPost.getContent());
            existing.setExcerpt(updatedPost.getExcerpt());
            existing.setSeoTitle(updatedPost.getSeoTitle());
            existing.setSeoDescription(updatedPost.getSeoDescription());
            existing.setVisibility(updatedPost.getVisibility());
            existing.setImageUrl(updatedPost.getImageUrl());
            existing.setAuthor(updatedPost.getAuthor());
            existing.setBlogCategory(updatedPost.getBlogCategory());
            existing.setTags(updatedPost.getTags());
            existing.setThemeTemplate(updatedPost.getThemeTemplate());
            existing.setCompanyId(updatedPost.getCompanyId());
            return blogPostRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Blog post not found with id " + id));
    }

    public void deleteBlogPost(Long id) {
        blogPostRepository.deleteById(id);
    }
}

package com.example.otpauth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(unique = true, nullable = false, length = 255)
    private String slug;

    @Column(length = 2000)
    private String excerpt;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 100)
    private String category = "Software";

    @Column(length = 150)
    private String author = "Akshay Patil";

    @Column(length = 150)
    private String authorRole = "Founder & CTO";

    @Column(length = 500)
    private String authorAvatar;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 255)
    private String coverColor = "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";

    @Column(length = 50)
    private String coverEmoji = "📦";

    @Column(length = 50)
    private String readTime = "5 min";

    @Column(length = 500)
    private String tags;

    @Column(length = 50)
    private String visibility = "Visible"; // "Visible" or "Hidden"

    @Column(length = 100)
    private String themeTemplate;

    @Column(name = "views_count")
    private Long viewsCount = 0L;

    @Column(name = "likes_count")
    private Long likesCount = 0L;

    @Column(length = 500)
    private String seoTitle;

    @Column(length = 1000)
    private String seoDescription;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
        if (viewsCount == null) viewsCount = 0L;
        if (likesCount == null) likesCount = 0L;
        if (visibility == null || visibility.isBlank()) visibility = "Visible";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public BlogPost() {}

    public BlogPost(String title, String slug, String excerpt, String content, String category,
                    String author, String authorRole, String coverColor, String coverEmoji,
                    String readTime, String tags) {
        this.title = title;
        this.slug = slug;
        this.excerpt = excerpt;
        this.content = content;
        this.category = category;
        this.author = author;
        this.authorRole = authorRole;
        this.coverColor = coverColor;
        this.coverEmoji = coverEmoji;
        this.readTime = readTime;
        this.tags = tags;
        this.visibility = "Visible";
        this.viewsCount = 0L;
        this.likesCount = 0L;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    // Compatibility getter/setter for blogCategory from UI forms
    public String getBlogCategory() { return category; }
    public void setBlogCategory(String blogCategory) { this.category = blogCategory; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCoverColor() { return coverColor; }
    public void setCoverColor(String coverColor) { this.coverColor = coverColor; }

    public String getCoverEmoji() { return coverEmoji; }
    public void setCoverEmoji(String coverEmoji) { this.coverEmoji = coverEmoji; }

    public String getReadTime() { return readTime; }
    public void setReadTime(String readTime) { this.readTime = readTime; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public String getThemeTemplate() { return themeTemplate; }
    public void setThemeTemplate(String themeTemplate) { this.themeTemplate = themeTemplate; }

    public Long getViewsCount() { return viewsCount; }
    public void setViewsCount(Long viewsCount) { this.viewsCount = viewsCount; }

    public Long getLikesCount() { return likesCount; }
    public void setLikesCount(Long likesCount) { this.likesCount = likesCount; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

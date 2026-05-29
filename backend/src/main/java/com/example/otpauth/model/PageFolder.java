package com.example.otpauth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "page_folders")
public class PageFolder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    public Long getUserId() { return user != null ? user.getId() : null; }
    public void setUserId(Long userId) {
        if (userId != null) {
            if (this.user == null) this.user = new User();
            this.user.setId(userId);
            this.userId = userId;
        } else {
            this.user = null;
            this.userId = null;
        }
    }

    @Column(nullable = false)
    private String name;

    @Column
    private String icon; // Lucide icon name (e.g., "Folder", "Home", "Settings")

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "folder_shares",
        joinColumns = @JoinColumn(name = "folder_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private java.util.Set<User> sharedWith = new java.util.HashSet<>();

    public PageFolder() {}

    public PageFolder(String name, User user) {
        this.name = name;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public java.util.Set<User> getSharedWith() {
        return sharedWith;
    }

    public void setSharedWith(java.util.Set<User> sharedWith) {
        this.sharedWith = sharedWith;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}

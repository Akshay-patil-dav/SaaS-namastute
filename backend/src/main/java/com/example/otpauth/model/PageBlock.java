package com.example.otpauth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "page_blocks")
public class PageBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "page_id", nullable = false)
    private CustomPage page;

    @Column(nullable = false)
    private String blockType;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Integer orderIndex;

    public PageBlock() {}

    public PageBlock(CustomPage page, String blockType, String content, Integer orderIndex) {
        this.page = page;
        this.blockType = blockType;
        this.content = content;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CustomPage getPage() {
        return page;
    }

    public void setPage(CustomPage page) {
        this.page = page;
    }

    public String getBlockType() {
        return blockType;
    }

    public void setBlockType(String blockType) {
        this.blockType = blockType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}

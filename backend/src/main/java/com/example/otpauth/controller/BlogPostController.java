package com.example.otpauth.controller;

import com.example.otpauth.model.BlogPost;
import com.example.otpauth.repository.BlogPostRepository;
import com.example.otpauth.util.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/blog-posts")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class BlogPostController implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(BlogPostController.class);
    private final BlogPostRepository blogPostRepository;

    public BlogPostController(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    /**
     * GET /api/blog-posts
     * Return posts. If publicOnly=true, returns visible posts only.
     */
    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String visibility,
            @RequestParam(required = false, defaultValue = "false") boolean publicOnly
    ) {
        List<BlogPost> posts;
        if (publicOnly || "Visible".equalsIgnoreCase(visibility)) {
            posts = blogPostRepository.findByVisibilityOrderByCreatedAtDesc("Visible");
        } else {
            posts = blogPostRepository.findAllByOrderByCreatedAtDesc();
        }

        if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
            posts = posts.stream()
                    .filter(p -> category.equalsIgnoreCase(p.getCategory()))
                    .toList();
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            posts = posts.stream()
                    .filter(p -> (p.getTitle() != null && p.getTitle().toLowerCase().contains(q))
                            || (p.getExcerpt() != null && p.getExcerpt().toLowerCase().contains(q))
                            || (p.getTags() != null && p.getTags().toLowerCase().contains(q)))
                    .toList();
        }

        return ResponseEntity.ok(posts);
    }

    /**
     * GET /api/blog-posts/public
     * Dedicated public endpoint for website visitors
     */
    @GetMapping("/public")
    public ResponseEntity<List<BlogPost>> getPublicPosts() {
        return ResponseEntity.ok(blogPostRepository.findByVisibilityOrderByCreatedAtDesc("Visible"));
    }

    /**
     * GET /api/blog-posts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Blog post not found"));
        }
        return ResponseEntity.ok(post.get());
    }

    /**
     * GET /api/blog-posts/slug/{slug}
     * Dynamic slug lookup + auto view counter increment
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getPostBySlug(@PathVariable String slug) {
        Optional<BlogPost> post = blogPostRepository.findBySlug(slug);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Article not found"));
        }
        BlogPost p = post.get();
        try {
            blogPostRepository.incrementViewsCount(p.getId());
            p.setViewsCount(p.getViewsCount() == null ? 1L : p.getViewsCount() + 1);
        } catch (Exception e) {
            log.warn("Could not increment view count: {}", e.getMessage());
        }
        return ResponseEntity.ok(p);
    }

    /**
     * POST /api/blog-posts
     * Create a new blog post
     */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody BlogPost request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Title is required"));
        }

        try {
            // Generate slug if absent
            String slug = request.getSlug();
            if (slug == null || slug.isBlank()) {
                slug = generateSlug(request.getTitle());
            } else {
                slug = cleanSlug(slug);
            }

            // Ensure unique slug
            String baseSlug = slug;
            int counter = 1;
            while (blogPostRepository.existsBySlug(slug)) {
                slug = baseSlug + "-" + counter;
                counter++;
            }
            request.setSlug(slug);

            // Auto-compute read time if missing
            if (request.getReadTime() == null || request.getReadTime().isBlank()) {
                request.setReadTime(calculateReadTime(request.getContent()));
            }

            // Set default gradient and emoji if empty
            if (request.getCoverColor() == null || request.getCoverColor().isBlank()) {
                request.setCoverColor(getCategoryDefaultGradient(request.getCategory()));
            }
            if (request.getCoverEmoji() == null || request.getCoverEmoji().isBlank()) {
                request.setCoverEmoji(getCategoryDefaultEmoji(request.getCategory()));
            }
            if (request.getAuthor() == null || request.getAuthor().isBlank()) {
                request.setAuthor("Akshay Patil");
            }
            if (request.getAuthorRole() == null || request.getAuthorRole().isBlank()) {
                request.setAuthorRole("Founder & CTO");
            }
            if (request.getVisibility() == null || request.getVisibility().isBlank()) {
                request.setVisibility("Visible");
            }

            Long currentUserId = SecurityUtils.getCurrentUserId();
            if (currentUserId != null) {
                request.setUserId(currentUserId);
            }

            BlogPost saved = blogPostRepository.save(request);
            log.info("Created new blog post: '{}' (slug: {})", saved.getTitle(), saved.getSlug());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            log.error("Failed to create blog post", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save blog post: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/blog-posts/{id}
     * Update an existing blog post
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody BlogPost request) {
        Optional<BlogPost> existingOpt = blogPostRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Blog post not found"));
        }

        try {
            BlogPost post = existingOpt.get();

            if (request.getTitle() != null && !request.getTitle().isBlank()) {
                post.setTitle(request.getTitle());
            }
            if (request.getContent() != null) {
                post.setContent(request.getContent());
                // recompute read time
                post.setReadTime(calculateReadTime(request.getContent()));
            }
            if (request.getExcerpt() != null) {
                post.setExcerpt(request.getExcerpt());
            }
            if (request.getCategory() != null) {
                post.setCategory(request.getCategory());
            }
            if (request.getAuthor() != null) {
                post.setAuthor(request.getAuthor());
            }
            if (request.getAuthorRole() != null) {
                post.setAuthorRole(request.getAuthorRole());
            }
            if (request.getAuthorAvatar() != null) {
                post.setAuthorAvatar(request.getAuthorAvatar());
            }
            if (request.getImageUrl() != null) {
                post.setImageUrl(request.getImageUrl());
            }
            if (request.getCoverColor() != null && !request.getCoverColor().isBlank()) {
                post.setCoverColor(request.getCoverColor());
            }
            if (request.getCoverEmoji() != null && !request.getCoverEmoji().isBlank()) {
                post.setCoverEmoji(request.getCoverEmoji());
            }
            if (request.getTags() != null) {
                post.setTags(request.getTags());
            }
            if (request.getVisibility() != null) {
                post.setVisibility(request.getVisibility());
            }
            if (request.getThemeTemplate() != null) {
                post.setThemeTemplate(request.getThemeTemplate());
            }
            if (request.getSeoTitle() != null) {
                post.setSeoTitle(request.getSeoTitle());
            }
            if (request.getSeoDescription() != null) {
                post.setSeoDescription(request.getSeoDescription());
            }

            // Slug update check if requested
            if (request.getSlug() != null && !request.getSlug().isBlank()) {
                String newSlug = cleanSlug(request.getSlug());
                if (!newSlug.equals(post.getSlug()) && !blogPostRepository.existsBySlugAndIdNot(newSlug, id)) {
                    post.setSlug(newSlug);
                }
            }

            post.setUpdatedAt(LocalDateTime.now());
            BlogPost updated = blogPostRepository.save(post);
            log.info("Updated blog post ID {}: '{}'", id, updated.getTitle());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Failed to update blog post", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update blog post: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/blog-posts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        if (!blogPostRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Blog post not found"));
        }
        blogPostRepository.deleteById(id);
        log.info("Deleted blog post ID {}", id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Blog post deleted successfully"));
    }

    /**
     * POST /api/blog-posts/{id}/like
     * Like an article
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Blog post not found"));
        }
        try {
            blogPostRepository.incrementLikesCount(id);
            BlogPost p = blogPostRepository.findById(id).orElse(post.get());
            return ResponseEntity.ok(Map.of("success", true, "likesCount", p.getLikesCount()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to like post"));
        }
    }

    /**
     * Helper to generate a clean URL slug from title
     */
    private String generateSlug(String title) {
        if (title == null) return "article-" + System.currentTimeMillis();
        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return slug.isBlank() ? "article-" + System.currentTimeMillis() : slug;
    }

    private String cleanSlug(String slug) {
        return slug.toLowerCase()
                .replaceAll("[^a-z0-9-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private String calculateReadTime(String content) {
        if (content == null || content.isBlank()) return "3 min";
        int words = content.trim().split("\\s+").length;
        int minutes = Math.max(1, (int) Math.ceil((double) words / 180));
        return minutes + " min";
    }

    private String getCategoryDefaultGradient(String category) {
        if (category == null) return "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
        return switch (category.toLowerCase()) {
            case "software" -> "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
            case "development" -> "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)";
            case "business" -> "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)";
            case "updates" -> "linear-gradient(135deg, #ff6b1a 0%, #ff8e53 100%)";
            case "tutorial" -> "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)";
            default -> "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)";
        };
    }

    private String getCategoryDefaultEmoji(String category) {
        if (category == null) return "📝";
        return switch (category.toLowerCase()) {
            case "software" -> "📦";
            case "development" -> "🏗️";
            case "business" -> "🛒";
            case "updates" -> "🚀";
            case "tutorial" -> "🏷️";
            default -> "💡";
        };
    }

    /**
     * Auto-seed default Namustutam blogs if database is empty on startup
     */
    @Override
    public void run(String... args) {
        try {
            if (blogPostRepository.count() == 0) {
                log.info("No blog posts found in DB. Seeding initial Namustutam articles...");
                seedDefaultBlogs();
                log.info("Successfully seeded default Namustutam blog articles!");
            }
        } catch (Exception e) {
            log.warn("Could not check or seed default blogs on startup: {}", e.getMessage());
        }
    }

    private void seedDefaultBlogs() {
        List<BlogPost> initialList = new ArrayList<>();

        initialList.add(new BlogPost(
                "How Namustutam Transformed Retail Inventory Management",
                "namustutam-retail-inventory",
                "Discover how our AI-powered inventory engine saves modern Indian retailers hours every week and reduces stockouts by 40%.",
                "## Introduction\n\nInventory management has long been the Achilles heel of retail businesses across India. With Namustutam POS, we set out to fundamentally change that.\n\n## The Problem\n\nManual stock tracking leads to costly errors, overstocking, and missed sales opportunities. Small businesses often rely on spreadsheets that don't scale.\n\n## Our Solution\n\nNamustutam's real-time inventory engine automatically tracks every transaction, triggers low-stock alerts, and generates purchase orders — all from one unified dashboard.\n\n## Key Results\n\n- **40% reduction** in retail stockouts\n- **60% faster** stock reconciliation\n- **80% less** manual data entry\n\n## Conclusion\n\nModern retail demands modern tools. Namustutam gives you the edge to compete — and win.",
                "Software",
                "Akshay Patil",
                "Founder & CTO",
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                "📦",
                "5 min",
                "inventory, retail, saas"
        ));

        initialList.add(new BlogPost(
                "Building a Multi-Tenant SaaS Architecture with Spring Boot",
                "multi-tenant-saas-spring-boot",
                "A deep dive into how we built a scalable, secure multi-tenant backend that serves hundreds of businesses from a single deployment.",
                "## Overview\n\nDesigning a multi-tenant SaaS platform is one of the most challenging architectural decisions you'll make. Here's how we did it at Namustutam.\n\n## Database Strategy\n\nWe chose a shared-schema approach with tenant IDs on every table, giving us the best balance of cost efficiency, performance, and data isolation.\n\n## Security & Isolation\n\nEvery API request is intercepted at the JWT filter layer to validate the tenant context before any business logic runs.\n\n## Lessons Learned\n\n1. Plan your tenant isolation model early.\n2. Use database-level indexing on tenant foreign keys.\n3. Cache aggressively at the tenant level with in-memory stores.\n\n## Conclusion\n\nWith the right architecture, a single Spring Boot application can serve thousands of tenants reliably and cost-effectively.",
                "Development",
                "Rahul Sharma",
                "Backend Engineer",
                "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                "🏗️",
                "8 min",
                "spring boot, architecture, backend"
        ));

        initialList.add(new BlogPost(
                "POS Billing for Indian Retailers: What to Look For",
                "pos-billing-indian-retailers",
                "A buyer's guide for choosing the right POS system for your Indian retail or F&B business.",
                "## Why Your POS Choice Matters\n\nYour Point of Sale system is the nerve center of your retail operation. Choosing poorly costs you time, money, and customer satisfaction.\n\n## Key Features Checklist\n\n- GST-compliant invoice generation\n- Offline mode support for network drops\n- Barcode & QR generation with thermal printer support\n- Real-time inventory sync across multiple counters\n- Multi-role staff access control\n\n## Namustutam vs. Alternatives\n\nWe compared leading platforms on price, features, and Indian compliance. Namustutam came out on top for mid-sized retail operations.\n\n## Conclusion\n\nDon't settle for generic software. Demand a platform built specifically for Indian retail growth.",
                "Business",
                "Priya S.",
                "Product Manager",
                "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                "🛒",
                "6 min",
                "pos, billing, retail"
        ));

        initialList.add(new BlogPost(
                "Namustutam v2.0 Launch: What's New",
                "namustutam-v2-launch",
                "Barcode & QR printing overhaul, role-based access improvements, and a brand-new analytics dashboard — all live now.",
                "## What's in v2.0\n\nAfter months of development and testing with real store owners, we're thrilled to announce Namustutam v2.0.\n\n## New Features\n\n### Barcode & QR Printing\nCustomize label sizes (36mm × 22mm, 38mm × 25mm), choose which fields to display, and print in bulk directly from thermal printers.\n\n### Advanced Analytics\nNew sales trend charts, product performance heatmaps, and exportable financial reports.\n\n### Role-Based Access\nFine-grained permissions for cashier, manager, and administrator roles.\n\n## How to Upgrade\n\nExisting customers are automatically upgraded without downtime. Enjoy the new interface!",
                "Updates",
                "Akshay Patil",
                "Founder & CTO",
                "linear-gradient(135deg, #ff6b1a 0%, #ff8e53 100%)",
                "🚀",
                "4 min",
                "release, features, update"
        ));

        initialList.add(new BlogPost(
                "How to Set Up Barcode Printing in Under 5 Minutes",
                "barcode-printing-tutorial",
                "Step-by-step guide to configuring your barcode label printer with Namustutam POS — no technical expertise needed.",
                "## Prerequisites\n\n- A supported thermal printer (Zebra, TSC, TVS, or any USB thermal printer)\n- Namustutam POS account (any active plan)\n\n## Step 1 — Connect Your Printer\n\nPlug in your printer via USB and install the manufacturer driver. Namustutam works directly through your browser's native print engine.\n\n## Step 2 — Configure Labels\n\nGo to Print Barcode → Configure. Choose your label size and toggle which fields (SKU, Price, Brand, Barcode) to show.\n\n## Step 3 — Select Products\n\nSearch for products by name or scan existing barcodes. Add them to your print queue.\n\n## Step 4 — Print\n\nClick 'Print' and select your thermal printer from the system dialog. Done!\n\n## Pro Tips\n\n- Use Print Preview before bulk printing to avoid paper waste\n- Save template presets for recurring product lines",
                "Tutorial",
                "Dev Team",
                "Engineering",
                "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                "🏷️",
                "3 min",
                "tutorial, barcode, printing"
        ));

        initialList.add(new BlogPost(
                "5 Ways to Reduce Retail Shrinkage with Better Inventory Tech",
                "reduce-retail-shrinkage",
                "Shrinkage costs Indian retailers billions every year. Here are five proven strategies powered by smart inventory software.",
                "## The Shrinkage Problem\n\nRetail shrinkage — from theft, damage, or administrative errors — can silently eat 1–3% of your annual revenue.\n\n## 1. Real-Time Stock Tracking\n\nKnow your exact stock levels at all times. Any unexplained discrepancies trigger automatic notifications.\n\n## 2. Barcode Scanning on Every Transaction\n\nManual data entry is the #1 cause of administrative shrinkage. Scan every barcode at checkout and intake.\n\n## 3. Role-Based Access Control\n\nLimit who can apply discounts, process returns, and adjust stock numbers.\n\n## 4. Regular Automated Audits\n\nSchedule daily or weekly spot-check stock reconciliations instead of once-a-year counts.\n\n## 5. Supplier Verification\n\nCross-check inbound deliveries against purchase orders automatically.\n\n## Conclusion\n\nWith smart software, shrinkage is manageable. Namustutam gives you full visibility and peace of mind.",
                "Business",
                "Ananya K.",
                "Business Analyst",
                "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
                "📉",
                "7 min",
                "inventory, business, tips"
        ));

        for (BlogPost bp : initialList) {
            blogPostRepository.save(bp);
        }
    }
}

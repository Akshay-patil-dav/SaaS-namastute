package com.example.otpauth.repository;

import com.example.otpauth.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    List<BlogPost> findByVisibilityOrderByCreatedAtDesc(String visibility);

    List<BlogPost> findAllByOrderByCreatedAtDesc();

    List<BlogPost> findByCategoryAndVisibilityOrderByCreatedAtDesc(String category, String visibility);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    @Transactional
    @Modifying
    @Query("UPDATE BlogPost b SET b.viewsCount = COALESCE(b.viewsCount, 0) + 1 WHERE b.id = :id")
    void incrementViewsCount(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("UPDATE BlogPost b SET b.likesCount = COALESCE(b.likesCount, 0) + 1 WHERE b.id = :id")
    void incrementLikesCount(@Param("id") Long id);
}

package com.example.otpauth.repository;

import com.example.otpauth.model.PageFolder;
import com.example.otpauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PageFolderRepository extends JpaRepository<PageFolder, Long> {
    List<PageFolder> findByUser(User user);

    /**
     * Returns all folders that the user owns OR has been invited to share.
     * Uses JOIN FETCH on sharedWith to avoid LazyInitializationException.
     */
    @Query("SELECT DISTINCT f FROM PageFolder f LEFT JOIN f.sharedWith sw WHERE f.user = :user OR sw = :user")
    List<PageFolder> findByUserOrSharedWith(@Param("user") User user);
}

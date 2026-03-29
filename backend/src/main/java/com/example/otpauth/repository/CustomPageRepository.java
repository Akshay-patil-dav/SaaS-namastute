package com.example.otpauth.repository;

import com.example.otpauth.model.CustomPage;
import com.example.otpauth.model.PageFolder;
import com.example.otpauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomPageRepository extends JpaRepository<CustomPage, Long> {
    List<CustomPage> findByUser(User user);
    List<CustomPage> findByFolder(PageFolder folder);

    /**
     * Returns all pages owned by the user, OR pages whose parent folder is shared with the user.
     */
    @Query("SELECT DISTINCT p FROM CustomPage p JOIN p.folder f LEFT JOIN f.sharedWith sw WHERE p.user = :user OR sw = :user")
    List<CustomPage> findByUserOrFolderSharedWith(@Param("user") User user);
}

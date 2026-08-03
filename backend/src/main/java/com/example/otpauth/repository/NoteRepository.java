package com.example.otpauth.repository;

import com.example.otpauth.model.Note;
import com.example.otpauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    @Query("SELECT n FROM Note n WHERE n.forAll = true OR n.targetUser = :user ORDER BY n.createdAt DESC")
    List<Note> findVisibleNotesForUser(@Param("user") User user);
    
    List<Note> findAllByOrderByCreatedAtDesc();
}

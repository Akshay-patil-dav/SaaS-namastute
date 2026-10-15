package com.example.otpauth.repository;

import com.example.otpauth.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Note> findByUserIdAndTargetUserIdOrUserIdAndForAllTrueOrderByCreatedAtDesc(Long userId1, Long targetUserId, Long userId2);
}

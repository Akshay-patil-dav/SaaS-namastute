package com.example.otpauth.controller;

import com.example.otpauth.dto.NoteDto;
import com.example.otpauth.dto.NoteRequest;
import com.example.otpauth.model.Note;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.NoteRepository;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteController(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/all")
    public ResponseEntity<List<NoteDto>> getAllNotes() {
        Long workspaceId = SecurityUtils.getCurrentUserId();
        if (workspaceId == null) return ResponseEntity.ok(List.of());

        List<Note> notes = noteRepository.findByUserIdOrderByCreatedAtDesc(workspaceId);
        return ResponseEntity.ok(convertToDto(notes));
    }

    @GetMapping("/my-notes")
    public ResponseEntity<List<NoteDto>> getMyNotes() {
        Long workspaceId = SecurityUtils.getCurrentUserId();
        Long actualUserId = SecurityUtils.getActualUserId();
        if (workspaceId == null) return ResponseEntity.ok(List.of());

        List<Note> notes;
        if (actualUserId != null && !actualUserId.equals(workspaceId)) {
            notes = noteRepository.findByUserIdAndTargetUserIdOrUserIdAndForAllTrueOrderByCreatedAtDesc(workspaceId, actualUserId, workspaceId);
        } else {
            notes = noteRepository.findByUserIdOrderByCreatedAtDesc(workspaceId);
        }

        return ResponseEntity.ok(convertToDto(notes));
    }

    @PostMapping
    public ResponseEntity<?> createNote(@RequestBody NoteRequest request) {
        Long workspaceId = SecurityUtils.getCurrentUserId();
        if (workspaceId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
        }

        if (request.getContent() == null || request.getContent().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Note content cannot be empty"));
        }

        Note note = new Note(
                request.getContent().trim(),
                workspaceId,
                request.getTargetUserId(),
                request.isForAll()
        );
        note = noteRepository.save(note);

        NoteDto dto = toDto(note);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        Long workspaceId = SecurityUtils.getCurrentUserId();
        if (workspaceId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not authenticated"));
        }

        noteRepository.findById(id).ifPresent(note -> {
            if (note.getUserId().equals(workspaceId)) {
                noteRepository.delete(note);
            }
        });
        return ResponseEntity.ok(Map.of("message", "Note deleted successfully"));
    }

    private List<NoteDto> convertToDto(List<Note> notes) {
        List<NoteDto> list = new ArrayList<>();
        for (Note n : notes) {
            list.add(toDto(n));
        }
        return list;
    }

    private NoteDto toDto(Note note) {
        NoteDto dto = new NoteDto();
        dto.setId(note.getId());
        dto.setContent(note.getContent());
        dto.setTargetUserId(note.getTargetUserId());
        dto.setForAll(note.isForAll());
        dto.setCreatedAt(note.getCreatedAt());

        if (note.getTargetUserId() != null) {
            userRepository.findById(note.getTargetUserId())
                    .ifPresent(u -> dto.setTargetUserName(u.getFullName() != null ? u.getFullName() : u.getEmail()));
        }
        return dto;
    }
}

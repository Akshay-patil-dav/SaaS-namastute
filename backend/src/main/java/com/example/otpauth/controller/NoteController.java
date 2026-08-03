package com.example.otpauth.controller;

import com.example.otpauth.dto.NoteDto;
import com.example.otpauth.dto.NoteRequest;
import com.example.otpauth.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteDto> createNote(@RequestBody NoteRequest request) {
        return ResponseEntity.ok(noteService.createNote(request));
    }

    @GetMapping("/all")
    public ResponseEntity<List<NoteDto>> getAllNotes() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-notes")
    public ResponseEntity<List<NoteDto>> getMyNotes(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(noteService.getVisibleNotesForUser(email));
    }
}

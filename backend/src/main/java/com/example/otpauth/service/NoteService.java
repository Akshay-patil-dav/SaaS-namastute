package com.example.otpauth.service;

import com.example.otpauth.dto.NoteDto;
import com.example.otpauth.dto.NoteRequest;
import com.example.otpauth.model.Note;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.NoteRepository;
import com.example.otpauth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    public NoteDto createNote(NoteRequest request) {
        Note note = new Note();
        note.setContent(request.getContent());
        note.setForAll(request.isForAll());
        
        if (!request.isForAll() && request.getTargetUserId() != null) {
            User targetUser = userRepository.findById(request.getTargetUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            note.setTargetUser(targetUser);
        }
        
        Note savedNote = noteRepository.save(note);
        return mapToDto(savedNote);
    }
    
    public List<NoteDto> getAllNotes() {
        return noteRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<NoteDto> getVisibleNotesForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findVisibleNotesForUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
    
    private NoteDto mapToDto(Note note) {
        NoteDto dto = new NoteDto();
        dto.setId(note.getId());
        dto.setContent(note.getContent());
        dto.setForAll(note.isForAll());
        dto.setCreatedAt(note.getCreatedAt());
        if (note.getTargetUser() != null) {
            dto.setTargetUserId(note.getTargetUser().getId());
            dto.setTargetUserName(note.getTargetUser().getFullName() != null ? note.getTargetUser().getFullName() : note.getTargetUser().getEmail());
        }
        return dto;
    }
}

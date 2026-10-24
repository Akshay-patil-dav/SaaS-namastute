package com.example.otpauth.controller;

import com.example.otpauth.model.ContactSubmission;
import com.example.otpauth.repository.ContactSubmissionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping({"/api/contact-submissions", "/api/contacts"})
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class ContactSubmissionController {

    private static final Logger log = LoggerFactory.getLogger(ContactSubmissionController.class);
    private final ContactSubmissionRepository contactSubmissionRepository;

    public ContactSubmissionController(ContactSubmissionRepository contactSubmissionRepository) {
        this.contactSubmissionRepository = contactSubmissionRepository;
    }

    /**
     * POST /api/contact-submissions
     * Public endpoint to submit a message from the website contact page.
     */
    @PostMapping
    public ResponseEntity<?> submitContactForm(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request
    ) {
        try {
            String name = (String) payload.get("name");
            String email = (String) payload.get("email");
            String message = (String) payload.get("message");
            String phone = (String) payload.get("phone");
            String subject = (String) payload.get("subject");
            String service = (String) payload.get("service");

            // Basic validation
            if (name == null || name.trim().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Full Name is required"));
            }
            if (email == null || email.trim().isBlank() || !email.contains("@")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "A valid Email Address is required"));
            }
            if (message == null || message.trim().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Message content is required"));
            }

            ContactSubmission submission = new ContactSubmission();
            submission.setName(name.trim());
            submission.setEmail(email.trim().toLowerCase());
            submission.setPhone(phone != null && !phone.isBlank() ? phone.trim() : null);
            submission.setSubject(subject != null && !subject.isBlank() ? subject.trim() : "General Website Inquiry");
            submission.setMessage(message.trim());
            submission.setService(service != null && !service.isBlank() ? service.trim() : null);
            submission.setStatus("NEW");

            // Extract client IP address
            String clientIp = request.getHeader("X-Forwarded-For");
            if (clientIp == null || clientIp.isBlank() || "unknown".equalsIgnoreCase(clientIp)) {
                clientIp = request.getRemoteAddr();
            } else if (clientIp.contains(",")) {
                clientIp = clientIp.split(",")[0].trim();
            }
            submission.setIpAddress(clientIp);

            ContactSubmission saved = contactSubmissionRepository.save(submission);
            log.info("[ContactSubmission] New inquiry received from '{}' <{}> (ID: {})", saved.getName(), saved.getEmail(), saved.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "Thank you! Your message has been received. Our team will contact you shortly.",
                    "data", saved
            ));
        } catch (Exception e) {
            log.error("[ContactSubmission] Error saving contact form submission: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "An unexpected error occurred while saving your inquiry. Please try again later."
            ));
        }
    }

    /**
     * GET /api/contact-submissions
     * Paginated list of submissions for Admin Panel with status filter, search, and summary stats.
     */
    @GetMapping
    public ResponseEntity<?> getSubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        try {
            Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
            Page<ContactSubmission> submissionPage = contactSubmissionRepository.searchSubmissions(
                    status,
                    search,
                    pageable
            );

            // Compute summary stats
            long total = contactSubmissionRepository.count();
            long newCount = contactSubmissionRepository.countByStatus("NEW");
            long readCount = contactSubmissionRepository.countByStatus("READ");
            long inProgressCount = contactSubmissionRepository.countByStatus("IN_PROGRESS");
            long repliedCount = contactSubmissionRepository.countByStatus("REPLIED");
            long resolvedCount = contactSubmissionRepository.countByStatus("RESOLVED");

            Map<String, Object> stats = new HashMap<>();
            stats.put("total", total);
            stats.put("newCount", newCount);
            stats.put("readCount", readCount);
            stats.put("inProgressCount", inProgressCount);
            stats.put("repliedCount", repliedCount);
            stats.put("resolvedCount", resolvedCount);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("content", submissionPage.getContent());
            response.put("totalElements", submissionPage.getTotalElements());
            response.put("totalPages", submissionPage.getTotalPages());
            response.put("currentPage", submissionPage.getNumber());
            response.put("pageSize", submissionPage.getSize());
            response.put("stats", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("[ContactSubmission] Error retrieving submissions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Failed to retrieve submissions: " + e.getMessage()
            ));
        }
    }

    /**
     * GET /api/contact-submissions/{id}
     * Get single inquiry details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(@PathVariable Long id) {
        Optional<ContactSubmission> subOpt = contactSubmissionRepository.findById(id);
        if (subOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Inquiry not found"
            ));
        }
        return ResponseEntity.ok(Map.of("success", true, "data", subOpt.get()));
    }

    /**
     * PATCH /api/contact-submissions/{id}/status
     * Update inquiry status and optional admin notes.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        Optional<ContactSubmission> subOpt = contactSubmissionRepository.findById(id);
        if (subOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Inquiry not found"
            ));
        }

        ContactSubmission submission = subOpt.get();
        if (payload.containsKey("status") && payload.get("status") != null) {
            submission.setStatus(payload.get("status").toString().toUpperCase());
        }
        if (payload.containsKey("adminNotes")) {
            submission.setAdminNotes((String) payload.get("adminNotes"));
        }
        submission.setUpdatedAt(LocalDateTime.now());

        ContactSubmission updated = contactSubmissionRepository.save(submission);
        log.info("[ContactSubmission] Inquiry #{} updated to status: {}", id, updated.getStatus());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Inquiry status updated successfully",
                "data", updated
        ));
    }

    /**
     * DELETE /api/contact-submissions/{id}
     * Delete an inquiry.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long id) {
        if (!contactSubmissionRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Inquiry not found"
            ));
        }
        contactSubmissionRepository.deleteById(id);
        log.info("[ContactSubmission] Inquiry #{} deleted", id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Inquiry deleted successfully"
        ));
    }

    /**
     * POST /api/contact-submissions/bulk-delete
     * Delete multiple inquiries by ID list.
     */
    @PostMapping("/bulk-delete")
    public ResponseEntity<?> bulkDelete(@RequestBody Map<String, List<Long>> payload) {
        List<Long> ids = payload.get("ids");
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "No IDs provided for bulk delete"
            ));
        }
        contactSubmissionRepository.deleteAllById(ids);
        log.info("[ContactSubmission] Deleted {} inquiries in bulk", ids.size());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", ids.size() + " inquiries deleted successfully"
        ));
    }
}

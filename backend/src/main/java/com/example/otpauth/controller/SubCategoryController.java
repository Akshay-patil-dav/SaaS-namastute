package com.example.otpauth.controller;

import com.example.otpauth.dto.SubCategoryRequest;
import com.example.otpauth.model.SubCategory;
import com.example.otpauth.service.SubCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subcategories")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174" ,"https://saa-s-namastute.vercel.app","https://vulcanizable-jedidiah-clownishly.ngrok-free.dev"})
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    public SubCategoryController(SubCategoryService subCategoryService) {
        this.subCategoryService = subCategoryService;
    }

    /** GET /api/subcategories — list all */
    @GetMapping
    public ResponseEntity<List<SubCategory>> getAllSubCategories() {
        return ResponseEntity.ok(subCategoryService.getAllSubCategories());
    }

    /** POST /api/subcategories — create */
    @PostMapping
    public ResponseEntity<?> createSubCategory(@RequestBody SubCategoryRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Sub Category name is required"));
            }
            if (request.getCategoryId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Category is required"));
            }
            SubCategory created = subCategoryService.createSubCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/subcategories/{id} — update */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubCategory(@PathVariable Long id, @RequestBody SubCategoryRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Sub Category name is required"));
            }
            return subCategoryService.updateSubCategory(id, request)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/subcategories/{id} — delete */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubCategory(@PathVariable Long id) {
        if (subCategoryService.deleteSubCategory(id)) {
            return ResponseEntity.ok(Map.of("message", "Sub Category deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Sub Category not found"));
    }

    /** POST /api/subcategories/delete-bulk — bulk delete */
    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteSubCategories(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            subCategoryService.bulkDeleteSubCategories(ids);
            return ResponseEntity.ok(Map.of("message", "Sub Categories deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

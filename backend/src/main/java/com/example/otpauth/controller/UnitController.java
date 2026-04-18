package com.example.otpauth.controller;

import com.example.otpauth.dto.UnitRequest;
import com.example.otpauth.model.Unit;
import com.example.otpauth.service.UnitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/units")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174" ,"https://saa-s-namastute.vercel.app","https://vulcanizable-jedidiah-clownishly.ngrok-free.dev/"})
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    /** GET /api/units — list all */
    @GetMapping
    public ResponseEntity<List<Unit>> getAllUnits() {
        return ResponseEntity.ok(unitService.getAllUnits());
    }

    /** POST /api/units — create */
    @PostMapping
    public ResponseEntity<?> createUnit(@RequestBody UnitRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Unit name is required"));
            }
            Unit created = unitService.createUnit(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/units/{id} — update */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUnit(@PathVariable Long id, @RequestBody UnitRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Unit name is required"));
            }
            return unitService.updateUnit(id, request)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/units/{id} — delete */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUnit(@PathVariable Long id) {
        if (unitService.deleteUnit(id)) {
            return ResponseEntity.ok(Map.of("message", "Unit deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Unit not found"));
    }

    /** POST /api/units/delete-bulk — bulk delete */
    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteUnits(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            unitService.bulkDeleteUnits(ids);
            return ResponseEntity.ok(Map.of("message", "Units deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

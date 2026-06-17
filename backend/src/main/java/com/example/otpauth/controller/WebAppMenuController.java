package com.example.otpauth.controller;

import com.example.otpauth.dto.WebAppMenuRequest;
import com.example.otpauth.model.WebAppMenu;
import com.example.otpauth.service.WebAppMenuService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menus")
public class WebAppMenuController {

    private final WebAppMenuService webAppMenuService;

    public WebAppMenuController(WebAppMenuService webAppMenuService) {
        this.webAppMenuService = webAppMenuService;
    }

    @GetMapping
    public ResponseEntity<List<WebAppMenu>> getAllMenus() {
        return ResponseEntity.ok(webAppMenuService.getAllMenus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuById(@PathVariable Long id) {
        return webAppMenuService.getMenuById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> createMenu(@RequestBody WebAppMenuRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Menu name is required"));
            }
            WebAppMenu created = webAppMenuService.createMenu(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenu(@PathVariable Long id, @RequestBody WebAppMenuRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Menu name is required"));
            }
            return webAppMenuService.updateMenu(id, request)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<?> setAsDefault(@PathVariable Long id) {
        if (webAppMenuService.setAsDefault(id)) {
            return ResponseEntity.ok(Map.of("message", "Menu set as default successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Menu not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenu(@PathVariable Long id) {
        if (webAppMenuService.deleteMenu(id)) {
            return ResponseEntity.ok(Map.of("message", "Menu deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Menu not found"));
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteMenus(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            webAppMenuService.bulkDeleteMenus(ids);
            return ResponseEntity.ok(Map.of("message", "Menus deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

package com.example.otpauth.controller;

import com.example.otpauth.dto.ProductRequest;
import com.example.otpauth.model.Product;
import com.example.otpauth.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /** GET /api/products — list all */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /** GET /api/products/expired — list expired items */
    @GetMapping("/expired")
    public ResponseEntity<List<Product>> getExpiredProducts() {
        return ResponseEntity.ok(productService.getExpiredProducts());
    }

    /** GET /api/products/search?q=... — search by name/barcode */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("q") String query) {
        if (query == null || query.length() < 2) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(productService.searchProducts(query));
    }


    /** GET /api/products/{id} — get one */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return productService.getProductById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found")));
    }

    /** POST /api/products — create */
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        try {
            if (request.getName() == null || request.getName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Product name is required"));
            }
            if (request.getPrice() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Price is required"));
            }
            Product created = productService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/products/{id} — update */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        return productService.updateProduct(id, request)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productService.deleteProduct(id)) {
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
    }

    /** POST /api/products/delete-bulk — bulk delete */
    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteProducts(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            productService.bulkDeleteProducts(ids);
            return ResponseEntity.ok(Map.of("message", "Products deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/products/generate-sku — generate unique SKU */
    @GetMapping("/generate-sku")
    public ResponseEntity<Map<String, String>> generateSku() {
        return ResponseEntity.ok(Map.of("sku", productService.generateSku()));
    }

    /** GET /api/products/generate-barcode — generate barcode */
    @GetMapping("/generate-barcode")
    public ResponseEntity<Map<String, String>> generateBarcode() {
        return ResponseEntity.ok(Map.of("barcode", productService.generateBarcode()));
    }
}

package com.example.otpauth.controller;

import com.example.otpauth.dto.SaleOrderRequest;
import com.example.otpauth.model.SaleOrder;
import com.example.otpauth.service.PosOrderService;
import com.example.otpauth.service.SaleOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
// CORS is handled globally in SecurityConfig.java — reads FRONTEND_URL from backend/.env
public class SaleOrderController {

    private final SaleOrderService saleOrderService;
    private final PosOrderService  posOrderService;

    public SaleOrderController(SaleOrderService saleOrderService,
                               PosOrderService  posOrderService) {
        this.saleOrderService = saleOrderService;
        this.posOrderService  = posOrderService;
    }

    /** GET /api/sales — list all orders (optionally search by ?q=...) */
    @GetMapping
    public ResponseEntity<List<SaleOrder>> getAllOrders(
            @RequestParam(value = "q", required = false) String q) {
        if (q != null && !q.isBlank()) {
            return ResponseEntity.ok(saleOrderService.searchOrders(q));
        }
        return ResponseEntity.ok(saleOrderService.getAllOrders());
    }

    /**
     * GET /api/sales/today/summary
     * Returns counts AND revenue (grandTotal sum) for Online Sales, POS Sales, and combined.
     * Response shape:
     *  {
     *    onlineCount, posCount, totalCount,
     *    onlineAmount, posAmount, totalAmount
     *  }
     */
    @GetMapping("/today/summary")
    public ResponseEntity<Map<String, Object>> getTodaySummary() {
        long       onlineCount  = saleOrderService.countTodaySales();
        long       posCount     = posOrderService.countTodaySales();
        BigDecimal onlineAmount = saleOrderService.sumTodayRevenue();
        BigDecimal posAmount    = posOrderService.sumTodayRevenue();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("onlineCount",  onlineCount);
        body.put("posCount",     posCount);
        body.put("totalCount",   onlineCount + posCount);
        body.put("onlineAmount", onlineAmount);
        body.put("posAmount",    posAmount);
        body.put("totalAmount",  onlineAmount.add(posAmount));
        return ResponseEntity.ok(body);
    }

    /** GET /api/sales/today/count — legacy alias, returns { "count": total } */
    @GetMapping("/today/count")
    public ResponseEntity<Map<String, Long>> getTodayCount() {
        long total = saleOrderService.countTodaySales() + posOrderService.countTodaySales();
        return ResponseEntity.ok(Map.of("count", total));
    }

    /** GET /api/sales/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return saleOrderService.getOrderById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Sale order not found")));
    }

    /** POST /api/sales */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody SaleOrderRequest request) {
        try {
            SaleOrder created = saleOrderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /api/sales/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id,
                                         @RequestBody SaleOrderRequest request) {
        try {
            SaleOrder updated = saleOrderService.updateOrder(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/sales/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            boolean deleted = saleOrderService.deleteOrder(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Sale order deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Sale order not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/delete-bulk")
    public ResponseEntity<?> bulkDeleteOrders(@RequestBody Map<String, List<Long>> payload) {
        try {
            List<Long> ids = payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No IDs provided"));
            }
            saleOrderService.bulkDeleteOrders(ids);
            return ResponseEntity.ok(Map.of("message", "Sale orders deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

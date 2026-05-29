package com.example.otpauth.service;

import com.example.otpauth.dto.PosOrderRequest;
import com.example.otpauth.model.PosOrder;
import com.example.otpauth.repository.PosOrderRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class PosOrderService {

    private final PosOrderRepository repository;
    private final ObjectMapper objectMapper;
    private final com.example.otpauth.repository.ProductRepository productRepository;

    public PosOrderService(PosOrderRepository repository, ObjectMapper objectMapper, com.example.otpauth.repository.ProductRepository productRepository) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.productRepository = productRepository;
    }

    public List<PosOrder> getAllOrders() {
        return repository.findAllByUserIdOrderByCreatedAtDesc(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<PosOrder> getOrderById(Long id) {
        return repository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public List<PosOrder> searchOrders(String q) {
        return repository.searchOrdersByUserId(q, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    /** Returns the number of POS orders placed today (based on the `date` field). */
    public long countTodaySales() {
        return repository.countByDateAndUserId(LocalDate.now(), com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    /** Returns the sum of grandTotal for all POS orders placed today. */
    public BigDecimal sumTodayRevenue() {
        BigDecimal result = repository.sumGrandTotalByDateAndUserId(LocalDate.now(), com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        return result != null ? result : BigDecimal.ZERO;
    }

    public PosOrder createOrder(PosOrderRequest request) throws JsonProcessingException {
        PosOrder order = new PosOrder();
        order.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        mapRequestToEntity(request, order);
        order.setReferenceNo("PO" + String.format("%06d", (long)(Math.random() * 1000000)));
        order.setBiller(request.getBiller() != null ? request.getBiller() : "Admin");

        // Decrease product quantity with live stock checks
        if (request.getProducts() != null) {
            for (PosOrderRequest.OrderProduct op : request.getProducts()) {
                if (op.getProductId() != null && op.getQuantity() != null && op.getQuantity() > 0) {
                    com.example.otpauth.model.Product product = productRepository.findById(op.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found with id: " + op.getProductId()));
                    int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
                    if (op.getQuantity() > currentQty) {
                        throw new RuntimeException("Insufficient stock for product: " + product.getName() 
                                + " (Requested: " + op.getQuantity() + ", Available: " + currentQty + ")");
                    }
                    product.setQuantity(currentQty - op.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        return repository.save(order);
    }

    public PosOrder updateOrder(Long id, PosOrderRequest request) throws JsonProcessingException {
        PosOrder order = repository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("POS order not found with id: " + id));
        mapRequestToEntity(request, order);
        if (request.getBiller() != null) order.setBiller(request.getBiller());
        return repository.save(order);
    }

    public boolean deleteOrder(Long id) {
        if (repository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteOrders(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<PosOrder> orders = repository.findAllById(ids);
        orders.removeIf(o -> !o.getUserId().equals(userId));
        repository.deleteAll(orders);
    }

    private void mapRequestToEntity(PosOrderRequest req, PosOrder order) throws JsonProcessingException {
        order.setCustomerName(req.getCustomerName());
        order.setStatus(req.getStatus() != null ? req.getStatus() : "Pending");
        order.setPaymentStatus(req.getPaymentStatus() != null ? req.getPaymentStatus() : "Unpaid");
        order.setNotes(req.getNotes());

        if (req.getDate() != null && !req.getDate().isBlank()) {
            try {
                LocalDate parsed = LocalDate.parse(req.getDate());
                order.setDate(parsed);
                order.setFormattedDate(parsed.format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            } catch (Exception ignored) {
                order.setDate(LocalDate.now());
                order.setFormattedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            }
        }

        BigDecimal orderTax   = safe(req.getOrderTax());
        BigDecimal discount   = safe(req.getDiscount());
        BigDecimal shipping   = safe(req.getShipping());
        BigDecimal paidAmount = safe(req.getPaidAmount());

        order.setOrderTax(orderTax);
        order.setDiscount(discount);
        order.setShipping(shipping);
        order.setPaidAmount(paidAmount);

        BigDecimal subtotal = BigDecimal.ZERO;
        if (req.getProducts() != null && !req.getProducts().isEmpty()) {
            for (PosOrderRequest.OrderProduct p : req.getProducts()) {
                int qty             = p.getQuantity() != null ? p.getQuantity() : 0;
                BigDecimal price    = safe(p.getUnitPrice());
                BigDecimal lineDsc  = safe(p.getDiscount());
                BigDecimal taxPct   = safe(p.getTaxPercent());
                BigDecimal lineBase = price.multiply(BigDecimal.valueOf(qty)).subtract(lineDsc);
                BigDecimal lineTax  = lineBase.multiply(taxPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                subtotal = subtotal.add(lineBase).add(lineTax);
            }
            order.setProductsJson(objectMapper.writeValueAsString(req.getProducts()));
        } else {
            order.setProductsJson("[]");
        }

        BigDecimal grandTotal = subtotal.add(orderTax).add(shipping).subtract(discount);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) grandTotal = BigDecimal.ZERO;
        order.setGrandTotal(grandTotal.setScale(2, RoundingMode.HALF_UP));

        BigDecimal due = grandTotal.subtract(paidAmount);
        if (due.compareTo(BigDecimal.ZERO) < 0) due = BigDecimal.ZERO;
        order.setDueAmount(due.setScale(2, RoundingMode.HALF_UP));
    }

    private BigDecimal safe(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }
}

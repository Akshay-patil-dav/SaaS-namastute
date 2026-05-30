package com.example.otpauth.service;

import com.example.otpauth.dto.SaleOrderRequest;
import com.example.otpauth.model.SaleOrder;
import com.example.otpauth.repository.SaleOrderRepository;
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
public class SaleOrderService {

    private final SaleOrderRepository repository;
    private final ObjectMapper objectMapper;
    private final com.example.otpauth.repository.ProductRepository productRepository;

    public SaleOrderService(SaleOrderRepository repository, ObjectMapper objectMapper, com.example.otpauth.repository.ProductRepository productRepository) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.productRepository = productRepository;
    }

    public List<SaleOrder> getAllOrders() {
        return repository.findAllByUserIdOrderByCreatedAtDesc(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<SaleOrder> getOrderById(Long id) {
        return repository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public List<SaleOrder> searchOrders(String q) {
        return repository.searchOrdersByUserId(q, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    /** Returns the number of sale orders placed today (based on the `date` field). */
    public long countTodaySales() {
        return repository.countByDateAndUserId(LocalDate.now(), com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    /** Returns the sum of grandTotal for all sale orders placed today. */
    public BigDecimal sumTodayRevenue() {
        BigDecimal result = repository.sumGrandTotalByDateAndUserId(LocalDate.now(), com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        return result != null ? result : BigDecimal.ZERO;
    }

    public SaleOrder createOrder(SaleOrderRequest request) throws JsonProcessingException {
        SaleOrder order = new SaleOrder();
        order.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        mapRequestToEntity(request, order);
        order.setReferenceNo("SL" + String.format("%06d", (long)(Math.random() * 1000000)));
        order.setBiller(request.getBiller() != null ? request.getBiller() : "Admin");

        // Decrease product quantity with live stock checks
        if (request.getProducts() != null) {
            for (SaleOrderRequest.OrderProduct op : request.getProducts()) {
                if (op.getProductId() != null && op.getQuantity() != null && op.getQuantity() > 0) {
                    com.example.otpauth.model.Product product = productRepository.findById(op.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found with id: " + op.getProductId()));
                    int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
                    if (op.getQuantity() > currentQty) {
                        throw new RuntimeException("Insufficient stock for product: " + product.getName() 
                                + " (Requested: " + op.getQuantity() + ", Available: " + currentQty + ")");
                    }
                    product.setQuantity(currentQty - op.getQuantity());
                    
                    if (op.getSku() != null && "Variable Product".equals(product.getProductType())) {
                        try {
                            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                            java.util.List<java.util.Map<String, Object>> variantTypes = mapper.readValue(product.getVariantsJson(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
                            for (java.util.Map<String, Object> vtMap : variantTypes) {
                                Object valuesObj = vtMap.get("values");
                                if (valuesObj instanceof java.util.List) {
                                    java.util.List<java.util.Map<String, Object>> valuesList = (java.util.List<java.util.Map<String, Object>>) valuesObj;
                                    for (java.util.Map<String, Object> vMap : valuesList) {
                                        if (op.getSku().equals(vMap.get("sku"))) {
                                            Object qtyObj = vMap.get("quantity");
                                            int vQty = 0;
                                            if (qtyObj instanceof Number) vQty = ((Number) qtyObj).intValue();
                                            else if (qtyObj instanceof String) {
                                                try { vQty = Integer.parseInt((String) qtyObj); } catch(Exception ignored){}
                                            }
                                            if (op.getQuantity() > vQty) {
                                                throw new RuntimeException("Insufficient stock for variant: " + op.getSku());
                                            }
                                            vMap.put("quantity", vQty - op.getQuantity());
                                        }
                                    }
                                }
                            }
                            product.setVariantsJson(mapper.writeValueAsString(variantTypes));
                        } catch (Exception e) {
                            if (e instanceof RuntimeException && e.getMessage().contains("Insufficient stock for variant")) {
                                throw (RuntimeException) e;
                            }
                            e.printStackTrace();
                        }
                    }

                    productRepository.save(product);
                }
            }
        }

        return repository.save(order);
    }

    public SaleOrder updateOrder(Long id, SaleOrderRequest request) throws JsonProcessingException {
        SaleOrder order = repository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Sale order not found with id: " + id));
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
        List<SaleOrder> orders = repository.findAllById(ids);
        orders.removeIf(o -> !o.getUserId().equals(userId));
        repository.deleteAll(orders);
    }

    // ── Internal mapping ─────────────────────────────────────────────────────

    private void mapRequestToEntity(SaleOrderRequest req, SaleOrder order) throws JsonProcessingException {
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

        BigDecimal orderTax   = safeDecimal(req.getOrderTax());
        BigDecimal discount   = safeDecimal(req.getDiscount());
        BigDecimal shipping   = safeDecimal(req.getShipping());
        BigDecimal paidAmount = safeDecimal(req.getPaidAmount());

        order.setOrderTax(orderTax);
        order.setDiscount(discount);
        order.setShipping(shipping);
        order.setPaidAmount(paidAmount);

        BigDecimal subtotal = BigDecimal.ZERO;
        if (req.getProducts() != null && !req.getProducts().isEmpty()) {
            for (SaleOrderRequest.OrderProduct p : req.getProducts()) {
                int qty = p.getQuantity() != null ? p.getQuantity() : 0;
                BigDecimal unitPrice    = safeDecimal(p.getUnitPrice());
                BigDecimal lineDiscount = safeDecimal(p.getDiscount());
                BigDecimal taxPct       = safeDecimal(p.getTaxPercent());
                BigDecimal lineBase     = unitPrice.multiply(BigDecimal.valueOf(qty)).subtract(lineDiscount);
                BigDecimal lineTax      = lineBase.multiply(taxPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
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

    private BigDecimal safeDecimal(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}

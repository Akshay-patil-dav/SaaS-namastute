package com.example.otpauth.service;

import com.example.otpauth.dto.SalesReturnRequest;
import com.example.otpauth.model.SalesReturn;
import com.example.otpauth.repository.SalesReturnRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SalesReturnService {

    private final SalesReturnRepository repository;
    private final ObjectMapper objectMapper;
    private final com.example.otpauth.repository.ProductRepository productRepository;

    public SalesReturnService(SalesReturnRepository repository, ObjectMapper objectMapper, com.example.otpauth.repository.ProductRepository productRepository) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.productRepository = productRepository;
    }

    /** Dashboard summary: total count, totalAmount, totalPaid, totalDue */
    public Map<String, Object> getSalesReturnSummary() {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        long totalCount       = repository.findByUserId(userId).size();
        BigDecimal totalAmount = repository.sumAllGrandTotalByUserId(userId);
        BigDecimal totalPaid   = repository.sumAllPaidAmountByUserId(userId);
        BigDecimal totalDue    = repository.sumAllDueAmountByUserId(userId);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalCount",  totalCount);
        summary.put("totalAmount", totalAmount);
        summary.put("totalPaid",   totalPaid);
        summary.put("totalDue",    totalDue);
        return summary;
    }

    public List<SalesReturn> getAllReturns() {
        return repository.findAllByUserIdOrderByCreatedAtDesc(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<SalesReturn> getReturnById(Long id) {
        return repository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public List<SalesReturn> searchReturns(String q) {
        return repository.searchReturnsByUserId(q, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public SalesReturn createReturn(SalesReturnRequest request) throws JsonProcessingException {
        SalesReturn salesReturn = new SalesReturn();
        salesReturn.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        mapRequestToEntity(request, salesReturn);
        salesReturn.setReferenceNo("SR" + String.format("%06d", (long)(Math.random() * 1000000)));
        salesReturn.setBiller(request.getBiller() != null ? request.getBiller() : "Admin");

        // Increase product quantity since customer returned the item
        if (request.getProducts() != null) {
            for (SalesReturnRequest.ReturnProduct rp : request.getProducts()) {
                if (rp.getProductId() != null && rp.getQuantity() != null && rp.getQuantity() > 0) {
                    productRepository.findById(rp.getProductId()).ifPresent(product -> {
                        int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
                        product.setQuantity(currentQty + rp.getQuantity());
                        
                        if (rp.getSku() != null && "Variable Product".equals(product.getProductType())) {
                            try {
                                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                                java.util.List<java.util.Map<String, Object>> variantTypes = mapper.readValue(product.getVariantsJson(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
                                for (java.util.Map<String, Object> vtMap : variantTypes) {
                                    Object valuesObj = vtMap.get("values");
                                    if (valuesObj instanceof java.util.List) {
                                        java.util.List<java.util.Map<String, Object>> valuesList = (java.util.List<java.util.Map<String, Object>>) valuesObj;
                                        for (java.util.Map<String, Object> vMap : valuesList) {
                                            if (rp.getSku().equals(vMap.get("sku"))) {
                                                Object qtyObj = vMap.get("quantity");
                                                int vQty = 0;
                                                if (qtyObj instanceof Number) vQty = ((Number) qtyObj).intValue();
                                                else if (qtyObj instanceof String) {
                                                    try { vQty = Integer.parseInt((String) qtyObj); } catch(Exception ignored){}
                                                }
                                                vMap.put("quantity", vQty + rp.getQuantity());
                                            }
                                        }
                                    }
                                }
                                product.setVariantsJson(mapper.writeValueAsString(variantTypes));
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }

                        productRepository.save(product);
                    });
                }
            }
        }

        return repository.save(salesReturn);
    }

    public SalesReturn updateReturn(Long id, SalesReturnRequest request) throws JsonProcessingException {
        SalesReturn salesReturn = repository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Sales return not found with id: " + id));
        mapRequestToEntity(request, salesReturn);
        if (request.getBiller() != null) salesReturn.setBiller(request.getBiller());
        return repository.save(salesReturn);
    }

    public boolean deleteReturn(Long id) {
        if (repository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteReturns(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<SalesReturn> returns = repository.findAllById(ids);
        returns.removeIf(r -> !r.getUserId().equals(userId));
        repository.deleteAll(returns);
    }

    private void mapRequestToEntity(SalesReturnRequest req, SalesReturn salesReturn) throws JsonProcessingException {
        salesReturn.setCustomerName(req.getCustomerName());
        salesReturn.setStatus(req.getStatus() != null ? req.getStatus() : "Pending");
        salesReturn.setPaymentStatus(req.getPaymentStatus() != null ? req.getPaymentStatus() : "Unpaid");
        salesReturn.setNotes(req.getNotes());

        if (req.getDate() != null && !req.getDate().isBlank()) {
            try {
                LocalDate parsed = LocalDate.parse(req.getDate());
                salesReturn.setDate(parsed);
                salesReturn.setFormattedDate(parsed.format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            } catch (Exception ignored) {
                salesReturn.setDate(LocalDate.now());
                salesReturn.setFormattedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            }
        }

        BigDecimal orderTax   = safe(req.getOrderTax());
        BigDecimal discount   = safe(req.getDiscount());
        BigDecimal shipping   = safe(req.getShipping());
        BigDecimal paidAmount = safe(req.getPaidAmount());

        salesReturn.setOrderTax(orderTax);
        salesReturn.setDiscount(discount);
        salesReturn.setShipping(shipping);
        salesReturn.setPaidAmount(paidAmount);

        BigDecimal subtotal = BigDecimal.ZERO;
        if (req.getProducts() != null && !req.getProducts().isEmpty()) {
            for (SalesReturnRequest.ReturnProduct p : req.getProducts()) {
                int qty             = p.getQuantity() != null ? p.getQuantity() : 0;
                BigDecimal price    = safe(p.getUnitPrice());
                BigDecimal lineDsc  = safe(p.getDiscount());
                BigDecimal taxPct   = safe(p.getTaxPercent());
                BigDecimal lineBase = price.multiply(BigDecimal.valueOf(qty)).subtract(lineDsc);
                BigDecimal lineTax  = lineBase.multiply(taxPct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                subtotal = subtotal.add(lineBase).add(lineTax);
            }
            salesReturn.setProductsJson(objectMapper.writeValueAsString(req.getProducts()));
        } else {
            salesReturn.setProductsJson("[]");
        }

        BigDecimal grandTotal = subtotal.add(orderTax).add(shipping).subtract(discount);
        if (grandTotal.compareTo(BigDecimal.ZERO) < 0) grandTotal = BigDecimal.ZERO;
        salesReturn.setGrandTotal(grandTotal.setScale(2, RoundingMode.HALF_UP));

        BigDecimal due = grandTotal.subtract(paidAmount);
        if (due.compareTo(BigDecimal.ZERO) < 0) due = BigDecimal.ZERO;
        salesReturn.setDueAmount(due.setScale(2, RoundingMode.HALF_UP));
    }

    private BigDecimal safe(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }
}

package com.example.otpauth.service;

import com.example.otpauth.dto.PurchaseRequest;
import com.example.otpauth.model.Purchase;
import com.example.otpauth.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final com.example.otpauth.repository.ProductRepository productRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public PurchaseService(PurchaseRepository purchaseRepository, 
                           com.example.otpauth.repository.ProductRepository productRepository,
                           com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public List<Purchase> searchPurchases(String query) {
        return purchaseRepository.searchPurchasesByUserId(query, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<Purchase> getPurchaseById(Long id) {
        return purchaseRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Double getPurchaseSummary() {
        return purchaseRepository.sumTotalActivePurchaseByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Long getPurchaseCount() {
        return purchaseRepository.countActivePurchasesByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Purchase createPurchase(PurchaseRequest request) {
        Purchase p = new Purchase();
        p.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        mapRequestToEntity(request, p);
        
        // Adjust product quantity and selling prices
        if (request.getProductsJson() != null && !request.getProductsJson().isBlank()) {
            applyProductUpdates(request.getProductsJson(), request.getStatus(), true);
        }

        return purchaseRepository.save(p);
    }

    public Purchase updatePurchase(Long id, PurchaseRequest request) {
        Purchase p = purchaseRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Purchase not found with id: " + id));
        mapRequestToEntity(request, p);
        
        // Update selling prices (skip stock adjustment to avoid double-adding)
        if (request.getProductsJson() != null && !request.getProductsJson().isBlank()) {
            applyProductUpdates(request.getProductsJson(), request.getStatus(), false);
        }
        
        return purchaseRepository.save(p);
    }

    private void applyProductUpdates(String productsJson, String status, boolean adjustStock) {
        try {
            java.util.List<java.util.Map<String, Object>> items = objectMapper.readValue(
                productsJson, 
                new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {}
            );
            boolean isReturn = status != null && 
                ("Return".equalsIgnoreCase(status) || "Returned".equalsIgnoreCase(status));
            for (java.util.Map<String, Object> item : items) {
                if (item.get("id") != null && item.get("qty") != null) {
                    Long productId = Long.valueOf(item.get("id").toString());
                    Integer qty = Integer.valueOf(item.get("qty").toString());
                    String sku = item.get("sku") != null ? item.get("sku").toString() : null;
                    java.math.BigDecimal newSellingPrice = null;
                    if (item.get("sellingPrice") != null) {
                        try { newSellingPrice = new java.math.BigDecimal(item.get("sellingPrice").toString()); } 
                        catch (Exception ignored) {}
                    }
                    final java.math.BigDecimal finalSellingPrice = newSellingPrice;

                    java.math.BigDecimal newPurchasePrice = null;
                    if (item.get("price") != null) {
                        try { newPurchasePrice = new java.math.BigDecimal(item.get("price").toString()); } 
                        catch (Exception ignored) {}
                    }
                    final java.math.BigDecimal finalPurchasePrice = newPurchasePrice;

                    productRepository.findById(productId).ifPresent(product -> {
                        // 1. Update overall selling price and purchase price if provided
                        if (finalSellingPrice != null && finalSellingPrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                            product.setPrice(finalSellingPrice);
                        }
                        if (finalPurchasePrice != null && finalPurchasePrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                            product.setPurchasePrice(finalPurchasePrice);
                        }

                        // 2. Adjust Stock if required
                        if (adjustStock) {
                            int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
                            if (isReturn) {
                                product.setQuantity(currentQty - qty);
                            } else {
                                product.setQuantity(currentQty + qty);
                            }
                        }

                        // 3. Variant specific logic
                        if (sku != null && "Variable Product".equals(product.getProductType())) {
                            try {
                                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                                java.util.List<java.util.Map<String, Object>> variantTypes = mapper.readValue(product.getVariantsJson(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
                                for (java.util.Map<String, Object> vtMap : variantTypes) {
                                    Object valuesObj = vtMap.get("values");
                                    if (valuesObj instanceof java.util.List) {
                                        java.util.List<java.util.Map<String, Object>> valuesList = (java.util.List<java.util.Map<String, Object>>) valuesObj;
                                        for (java.util.Map<String, Object> vMap : valuesList) {
                                            if (sku.equals(vMap.get("sku"))) {
                                                // Update variant prices
                                                if (finalSellingPrice != null && finalSellingPrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                                                    vMap.put("price", finalSellingPrice.toPlainString());
                                                }
                                                if (finalPurchasePrice != null && finalPurchasePrice.compareTo(java.math.BigDecimal.ZERO) > 0) {
                                                    vMap.put("purchasePrice", finalPurchasePrice.toPlainString());
                                                }
                                                // Adjust variant stock
                                                if (adjustStock) {
                                                    Object qtyObj = vMap.get("quantity");
                                                    int vQty = 0;
                                                    if (qtyObj instanceof Number) vQty = ((Number) qtyObj).intValue();
                                                    else if (qtyObj instanceof String) {
                                                        try { vQty = Integer.parseInt((String) qtyObj); } catch(Exception ignored){}
                                                    }
                                                    if (isReturn) {
                                                        vMap.put("quantity", vQty - qty);
                                                    } else {
                                                        vMap.put("quantity", vQty + qty);
                                                    }
                                                }
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
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public boolean deletePurchase(Long id) {
        if (purchaseRepository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            purchaseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeletePurchases(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<Purchase> purchases = purchaseRepository.findAllById(ids);
        purchases.removeIf(p -> !p.getUserId().equals(userId));
        purchaseRepository.deleteAll(purchases);
    }

    private void mapRequestToEntity(PurchaseRequest request, Purchase p) {
        if (request.getReference() != null) p.setReference(request.getReference());
        if (request.getSupplier() != null) p.setSupplier(request.getSupplier());
        if (request.getDate() != null) p.setDate(request.getDate());
        if (request.getStatus() != null) p.setStatus(request.getStatus());
        if (request.getPaymentStatus() != null) p.setPaymentStatus(request.getPaymentStatus());
        if (request.getOrderTax() != null) p.setOrderTax(request.getOrderTax());
        if (request.getDiscount() != null) p.setDiscount(request.getDiscount());
        if (request.getShipping() != null) p.setShipping(request.getShipping());
        if (request.getTotal() != null) p.setTotal(request.getTotal());
        if (request.getPaid() != null) p.setPaid(request.getPaid());
        if (request.getDue() != null) p.setDue(request.getDue());
        if (request.getProductsJson() != null) p.setProductsJson(request.getProductsJson());
        if (request.getNotes() != null) p.setNotes(request.getNotes());
    }
}

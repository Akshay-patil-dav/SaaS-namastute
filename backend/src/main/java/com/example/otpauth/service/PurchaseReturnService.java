package com.example.otpauth.service;

import com.example.otpauth.dto.PurchaseReturnRequest;
import com.example.otpauth.model.PurchaseReturn;
import com.example.otpauth.repository.PurchaseReturnRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseReturnService {

    private final PurchaseReturnRepository purchaseReturnRepository;
    private final com.example.otpauth.repository.ProductRepository productRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private final com.example.otpauth.repository.PurchaseRepository purchaseRepository;

    public PurchaseReturnService(PurchaseReturnRepository purchaseReturnRepository,
                                 com.example.otpauth.repository.ProductRepository productRepository,
                                 com.fasterxml.jackson.databind.ObjectMapper objectMapper,
                                 com.example.otpauth.repository.PurchaseRepository purchaseRepository) {
        this.purchaseReturnRepository = purchaseReturnRepository;
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
        this.purchaseRepository = purchaseRepository;
    }

    public List<PurchaseReturn> getAllPurchaseReturns() {
        return purchaseReturnRepository.findByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public List<PurchaseReturn> searchPurchaseReturns(String query) {
        return purchaseReturnRepository.searchPurchaseReturnsByUserId(query, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<PurchaseReturn> getPurchaseReturnById(Long id) {
        return purchaseReturnRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Double getPurchaseReturnSummary() {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        Double returnsSum = purchaseReturnRepository.sumTotalPurchaseReturnByUserId(userId);
        Double purchaseReturnsSum = purchaseRepository.sumTotalPurchaseReturnsByUserId(userId);
        return (returnsSum != null ? returnsSum : 0.0) + (purchaseReturnsSum != null ? purchaseReturnsSum : 0.0);
    }

    public Long getPurchaseReturnCount() {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        return purchaseReturnRepository.findByUserId(userId).size() + purchaseRepository.countPurchaseReturnsByUserId(userId);
    }

    public PurchaseReturn createPurchaseReturn(PurchaseReturnRequest request) {
        PurchaseReturn p = new PurchaseReturn();
        p.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        mapRequestToEntity(request, p);

        // Decrease product quantity since it is returned to supplier
        if (request.getProductsJson() != null && !request.getProductsJson().isBlank()) {
            try {
                java.util.List<java.util.Map<String, Object>> items = objectMapper.readValue(
                    request.getProductsJson(), 
                    new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {}
                );
                for (java.util.Map<String, Object> item : items) {
                    if (item.get("id") != null && item.get("qty") != null) {
                        Long productId = Long.valueOf(item.get("id").toString());
                        Integer qty = Integer.valueOf(item.get("qty").toString());
                        productRepository.findById(productId).ifPresent(product -> {
                            int currentQty = product.getQuantity() != null ? product.getQuantity() : 0;
                            product.setQuantity(currentQty - qty);
                            productRepository.save(product);
                        });
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return purchaseReturnRepository.save(p);
    }

    public PurchaseReturn updatePurchaseReturn(Long id, PurchaseReturnRequest request) {
        PurchaseReturn p = purchaseReturnRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("PurchaseReturn not found with id: " + id));
        mapRequestToEntity(request, p);
        return purchaseReturnRepository.save(p);
    }

    public boolean deletePurchaseReturn(Long id) {
        if (purchaseReturnRepository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            purchaseReturnRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeletePurchaseReturns(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<PurchaseReturn> returns = purchaseReturnRepository.findAllById(ids);
        returns.removeIf(r -> !r.getUserId().equals(userId));
        purchaseReturnRepository.deleteAll(returns);
    }

    private void mapRequestToEntity(PurchaseReturnRequest request, PurchaseReturn p) {
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

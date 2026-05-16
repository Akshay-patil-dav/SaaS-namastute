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

    public PurchaseReturnService(PurchaseReturnRepository purchaseReturnRepository,
                                 com.example.otpauth.repository.ProductRepository productRepository,
                                 com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.purchaseReturnRepository = purchaseReturnRepository;
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    public List<PurchaseReturn> getAllPurchaseReturns() {
        return purchaseReturnRepository.findAll();
    }

    public List<PurchaseReturn> searchPurchaseReturns(String query) {
        return purchaseReturnRepository.searchPurchaseReturns(query);
    }

    public Optional<PurchaseReturn> getPurchaseReturnById(Long id) {
        return purchaseReturnRepository.findById(id);
    }

    public PurchaseReturn createPurchaseReturn(PurchaseReturnRequest request) {
        PurchaseReturn p = new PurchaseReturn();
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
        PurchaseReturn p = purchaseReturnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PurchaseReturn not found with id: " + id));
        mapRequestToEntity(request, p);
        return purchaseReturnRepository.save(p);
    }

    public boolean deletePurchaseReturn(Long id) {
        if (purchaseReturnRepository.existsById(id)) {
            purchaseReturnRepository.deleteById(id);
            return true;
        }
        return false;
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

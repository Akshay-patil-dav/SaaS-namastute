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

    public PurchaseService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    public List<Purchase> searchPurchases(String query) {
        return purchaseRepository.searchPurchases(query);
    }

    public Optional<Purchase> getPurchaseById(Long id) {
        return purchaseRepository.findById(id);
    }

    public Purchase createPurchase(PurchaseRequest request) {
        Purchase p = new Purchase();
        mapRequestToEntity(request, p);
        return purchaseRepository.save(p);
    }

    public Purchase updatePurchase(Long id, PurchaseRequest request) {
        Purchase p = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found with id: " + id));
        mapRequestToEntity(request, p);
        return purchaseRepository.save(p);
    }

    public boolean deletePurchase(Long id) {
        if (purchaseRepository.existsById(id)) {
            purchaseRepository.deleteById(id);
            return true;
        }
        return false;
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

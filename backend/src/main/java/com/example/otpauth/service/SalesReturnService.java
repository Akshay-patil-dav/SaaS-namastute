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
import java.util.List;
import java.util.Optional;

@Service
public class SalesReturnService {

    private final SalesReturnRepository repository;
    private final ObjectMapper objectMapper;

    public SalesReturnService(SalesReturnRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public List<SalesReturn> getAllReturns() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<SalesReturn> getReturnById(Long id) {
        return repository.findById(id);
    }

    public List<SalesReturn> searchReturns(String q) {
        return repository.searchReturns(q);
    }

    public SalesReturn createReturn(SalesReturnRequest request) throws JsonProcessingException {
        SalesReturn salesReturn = new SalesReturn();
        mapRequestToEntity(request, salesReturn);
        salesReturn.setReferenceNo("SR" + String.format("%06d", (long)(Math.random() * 1000000)));
        salesReturn.setBiller(request.getBiller() != null ? request.getBiller() : "Admin");
        return repository.save(salesReturn);
    }

    public SalesReturn updateReturn(Long id, SalesReturnRequest request) throws JsonProcessingException {
        SalesReturn salesReturn = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales return not found with id: " + id));
        mapRequestToEntity(request, salesReturn);
        if (request.getBiller() != null) salesReturn.setBiller(request.getBiller());
        return repository.save(salesReturn);
    }

    public boolean deleteReturn(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
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

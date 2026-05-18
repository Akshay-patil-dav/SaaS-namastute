package com.example.otpauth.service;

import com.example.otpauth.dto.TransferRequest;
import com.example.otpauth.model.StockTransfer;
import com.example.otpauth.repository.StockTransferRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StockTransferService {

    private final StockTransferRepository repository;
    private final ObjectMapper objectMapper;

    public StockTransferService(StockTransferRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public List<StockTransfer> getAllTransfers() {
        return repository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<StockTransfer> getTransferById(Long id) {
        return repository.findById(id);
    }

    public StockTransfer createTransfer(TransferRequest request) throws JsonProcessingException {
        StockTransfer transfer = new StockTransfer();
        mapRequestToEntity(request, transfer);
        return repository.save(transfer);
    }

    public StockTransfer updateTransfer(Long id, TransferRequest request) throws JsonProcessingException {
        StockTransfer transfer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transfer not found"));
        mapRequestToEntity(request, transfer);
        return repository.save(transfer);
    }

    public StockTransfer importTransferFromCsv(MultipartFile file, TransferRequest request) throws Exception {
        StockTransfer transfer = new StockTransfer();
        
        List<TransferRequest.TransferProduct> products = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                if (line.trim().isEmpty()) continue;
                
                String[] columns = line.split(",");
                if (columns.length >= 5) {
                    TransferRequest.TransferProduct product = new TransferRequest.TransferProduct();
                    try {
                        product.setProductId(Long.parseLong(columns[0].trim()));
                    } catch (NumberFormatException e) {
                        product.setProductId((long) (Math.random() * 1000));
                    }
                    product.setName(columns[1].trim());
                    product.setSku(columns[2].trim());
                    product.setCategory(columns[3].trim());
                    try {
                        product.setQuantity(Integer.parseInt(columns[4].trim()));
                    } catch (NumberFormatException e) {
                        product.setQuantity(1);
                    }
                    product.setImg("");
                    products.add(product);
                }
            }
        }
        
        request.setProducts(products);
        mapRequestToEntity(request, transfer);
        
        return repository.save(transfer);
    }

    public boolean deleteTransfer(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteTransfers(List<Long> ids) {
        repository.deleteAllById(ids);
    }

    private void mapRequestToEntity(TransferRequest request, StockTransfer transfer) throws JsonProcessingException {
        transfer.setFromWarehouse(request.getResolvedFrom());
        transfer.setToWarehouse(request.getResolvedTo());
        
        // Some forms might not have referenceNo, so generate one if missing
        if (request.getReferenceNo() != null && !request.getReferenceNo().isEmpty()) {
            transfer.setReferenceNo(request.getReferenceNo());
        } else if (transfer.getReferenceNo() == null) {
            transfer.setReferenceNo("#" + (long) (Math.random() * 1000000));
        }

        transfer.setNotes(request.getNotes());
        transfer.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");
        transfer.setShipping(request.getShipping());
        transfer.setDescription(request.getDescription());

        if (request.getProducts() != null && !request.getProducts().isEmpty()) {
            String productsJson = objectMapper.writeValueAsString(request.getProducts());
            transfer.setProductsJson(productsJson);
            
            transfer.setNoOfProducts(request.getProducts().size());
            int totalQty = request.getProducts().stream()
                    .mapToInt(p -> p.getQuantity() != null ? p.getQuantity() : 0)
                    .sum();
            transfer.setQuantityTransferred(totalQty);
        } else {
            transfer.setNoOfProducts(0);
            transfer.setQuantityTransferred(0);
        }
    }
}

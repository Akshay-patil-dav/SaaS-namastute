package com.example.otpauth.service;

import com.example.otpauth.dto.TransferRequest;
import com.example.otpauth.model.StockTransfer;
import com.example.otpauth.repository.StockTransferRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockTransferService {

    private final StockTransferRepository repository;
    private final ObjectMapper objectMapper;

    public StockTransferService(StockTransferRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public List<StockTransfer> getAllTransfers() {
        return repository.findAll();
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

    public boolean deleteTransfer(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
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

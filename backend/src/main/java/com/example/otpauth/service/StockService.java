package com.example.otpauth.service;

import com.example.otpauth.dto.StockBatchRequest;
import com.example.otpauth.dto.StockUpdateRequest;
import com.example.otpauth.model.Product;
import com.example.otpauth.model.Stock;
import com.example.otpauth.repository.ProductRepository;
import com.example.otpauth.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;

    public StockService(StockRepository stockRepository, ProductRepository productRepository) {
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAllByUserIdOrderByCreatedAtDesc(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    @Transactional
    public List<Stock> createStocks(StockBatchRequest request) {
        List<Stock> createdStocks = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (StockBatchRequest.StockItemRequest item : request.getProducts()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + item.getProductId()));

            // Create Stock Record
            Stock stock = new Stock();
            stock.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
            stock.setWarehouse(request.getWarehouse());
            stock.setStore(request.getStore());
            stock.setResponsiblePerson(request.getResponsiblePerson());
            stock.setProductId(product.getId());
            stock.setProductName(product.getName());
            stock.setProductSku(product.getSku());
            stock.setProductCategory(product.getCategory());
            stock.setQuantity(item.getQuantity());
            stock.setDate(today);
            
            // Handle images
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                stock.setProductImg(product.getImages().split(",")[0].trim());
            }

            // Save Stock Record
            createdStocks.add(stockRepository.save(stock));

            // Update Product Quantity
            product.setQuantity(product.getQuantity() + item.getQuantity());
            
            if (item.getSku() != null && "Variable Product".equals(product.getProductType())) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    java.util.List<java.util.Map<String, Object>> variantTypes = mapper.readValue(product.getVariantsJson(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
                    for (java.util.Map<String, Object> vtMap : variantTypes) {
                        Object valuesObj = vtMap.get("values");
                        if (valuesObj instanceof java.util.List) {
                            java.util.List<java.util.Map<String, Object>> valuesList = (java.util.List<java.util.Map<String, Object>>) valuesObj;
                            for (java.util.Map<String, Object> vMap : valuesList) {
                                if (item.getSku().equals(vMap.get("sku"))) {
                                    Object qtyObj = vMap.get("quantity");
                                    int vQty = 0;
                                    if (qtyObj instanceof Number) vQty = ((Number) qtyObj).intValue();
                                    else if (qtyObj instanceof String) {
                                        try { vQty = Integer.parseInt((String) qtyObj); } catch(Exception ignored){}
                                    }
                                    vMap.put("quantity", vQty + item.getQuantity());
                                    stock.setProductSku(item.getSku());
                                }
                            }
                        }
                    }
                    product.setVariantsJson(mapper.writeValueAsString(variantTypes));
                    stockRepository.save(stock); // Re-save with updated SKU
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else if (item.getSku() != null) {
                stock.setProductSku(item.getSku());
                stockRepository.save(stock); // Re-save with updated SKU
            }
            
            productRepository.save(product);
        }

        return createdStocks;
    }
    
    public Optional<Stock> getStockById(Long id) {
        return stockRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    @Transactional
    public Stock updateStock(Long id, StockUpdateRequest req) {
        Stock stock = stockRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("Stock record not found"));

        // Adjust product quantity and potentially swap product
        if (req.getProductId() != null && !req.getProductId().equals(stock.getProductId())) {
            // Revert old product quantity
            productRepository.findById(stock.getProductId()).ifPresent(oldProduct -> {
                oldProduct.setQuantity(Math.max(0, oldProduct.getQuantity() - stock.getQuantity()));
                productRepository.save(oldProduct);
            });
            
            // Add to new product
            Product newProduct = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("New product not found"));
            newProduct.setQuantity(newProduct.getQuantity() + (req.getQuantity() != null ? req.getQuantity() : stock.getQuantity()));
            productRepository.save(newProduct);
            
            stock.setProductId(newProduct.getId());
            stock.setProductName(req.getProductName());
            stock.setProductSku(req.getProductSku());
            stock.setProductCategory(req.getProductCategory());
            stock.setProductImg(req.getProductImg());
            if (req.getQuantity() != null) stock.setQuantity(req.getQuantity());
            
        } else if (req.getQuantity() != null) {
            Product product = productRepository.findById(stock.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            int diff = req.getQuantity() - stock.getQuantity();
            product.setQuantity(product.getQuantity() + diff);
            productRepository.save(product);
            
            stock.setQuantity(req.getQuantity());
        }

        if (req.getWarehouse() != null) stock.setWarehouse(req.getWarehouse());
        if (req.getStore()     != null) stock.setStore(req.getStore());
        if (req.getResponsiblePerson() != null) stock.setResponsiblePerson(req.getResponsiblePerson());

        return stockRepository.save(stock);
    }

    @Transactional
    public boolean deleteStock(Long id) {
        return stockRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(stock -> {
            // Revert product quantity
            productRepository.findById(stock.getProductId()).ifPresent(product -> {
                product.setQuantity(Math.max(0, product.getQuantity() - stock.getQuantity()));
                productRepository.save(product);
            });
            
            // Delete the stock entry
            stockRepository.delete(stock);
            return true;
        }).orElse(false);
    }

    @Transactional
    public void bulkDeleteStocks(List<Long> ids) {
        for (Long id : ids) {
            deleteStock(id);
        }
    }
}

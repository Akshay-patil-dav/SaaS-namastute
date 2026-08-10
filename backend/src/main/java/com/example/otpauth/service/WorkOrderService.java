package com.example.otpauth.service;

import com.example.otpauth.dto.WorkOrderDTO;
import com.example.otpauth.model.BillOfMaterial;
import com.example.otpauth.model.BomItem;
import com.example.otpauth.model.Product;
import com.example.otpauth.model.WorkOrder;
import com.example.otpauth.repository.BillOfMaterialRepository;
import com.example.otpauth.repository.ProductRepository;
import com.example.otpauth.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class WorkOrderService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private BillOfMaterialRepository bomRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<WorkOrder> getWorkOrdersByUserId(Long userId) {
        return workOrderRepository.findByUserId(userId);
    }

    @Transactional
    public WorkOrder createWorkOrder(Long userId, WorkOrderDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
                
        BillOfMaterial bom = bomRepository.findById(dto.getBomId())
                .orElseThrow(() -> new RuntimeException("BOM not found"));

        if (!product.getUserId().equals(userId) || !bom.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        WorkOrder order = new WorkOrder();
        order.setUserId(userId);
        order.setProduct(product);
        order.setBillOfMaterial(bom);
        order.setQuantityToProduce(dto.getQuantityToProduce());
        order.setStatus("DRAFT");
        order.setOrderNumber("WO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return workOrderRepository.save(order);
    }

    @Autowired
    private com.example.otpauth.repository.StockRepository stockRepository;

    @Transactional
    public WorkOrder updateStatus(Long id, Long userId, String status) {
        WorkOrder order = workOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work Order not found"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if ("COMPLETED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already completed");
        }

        order.setStatus(status);

        if ("COMPLETED".equals(status)) {
            order.setCompletedAt(LocalDateTime.now());
            
            int multiplier = order.getQuantityToProduce().intValue();

            // 1. Stock Sufficiency Check
            for (BomItem item : order.getBillOfMaterial().getItems()) {
                Product ingredient = item.getIngredient();
                int deductQty = (int) Math.ceil(item.getQuantityRequired().doubleValue() * multiplier);
                int availableStock = ingredient.getQuantity() != null ? ingredient.getQuantity() : 0;
                if (availableStock < deductQty) {
                    throw new RuntimeException("Insufficient stock for raw material '" + ingredient.getName() + "'. Required: " + deductQty + ", Available: " + availableStock);
                }
            }

            // 2. Deduct Ingredients, Save Product & Create Stock Audit Record
            java.math.BigDecimal totalMaterialCost = java.math.BigDecimal.ZERO;
            for (BomItem item : order.getBillOfMaterial().getItems()) {
                Product ingredient = item.getIngredient();
                int deductQty = (int) Math.ceil(item.getQuantityRequired().doubleValue() * multiplier);
                ingredient.setQuantity(ingredient.getQuantity() - deductQty);
                productRepository.save(ingredient);

                // Create Stock audit entry for raw material deduction
                try {
                    com.example.otpauth.model.Stock rmStock = new com.example.otpauth.model.Stock();
                    rmStock.setUserId(userId);
                    rmStock.setProductId(ingredient.getId());
                    rmStock.setProductName(ingredient.getName());
                    rmStock.setProductSku(ingredient.getSku());
                    rmStock.setProductCategory(ingredient.getCategory());
                    rmStock.setQuantity(-deductQty);
                    rmStock.setWarehouse(ingredient.getWarehouse() != null ? ingredient.getWarehouse() : "Factory Main Warehouse");
                    rmStock.setStore(ingredient.getStore() != null ? ingredient.getStore() : "Production Line");
                    rmStock.setResponsiblePerson("Manufacturing (WO: " + order.getOrderNumber() + ")");
                    rmStock.setDate(java.time.LocalDate.now());
                    if (ingredient.getImages() != null && !ingredient.getImages().isEmpty()) {
                        rmStock.setProductImg(ingredient.getImages().split(",")[0].trim());
                    }
                    stockRepository.save(rmStock);
                } catch (Exception ignored) {}

                java.math.BigDecimal unitCost = ingredient.getPurchasePrice() != null ? ingredient.getPurchasePrice() : java.math.BigDecimal.ZERO;
                java.math.BigDecimal itemCost = unitCost.multiply(item.getQuantityRequired()).multiply(order.getQuantityToProduce());
                totalMaterialCost = totalMaterialCost.add(itemCost);
            }

            // 3. Add Finished Good Stock, Update Unit Cost & Create Stock Audit Record
            Product finishedGood = order.getProduct();
            int currentQty = finishedGood.getQuantity() != null ? finishedGood.getQuantity() : 0;
            finishedGood.setQuantity(currentQty + multiplier);
            
            if (multiplier > 0) {
                java.math.BigDecimal unitProductionCost = totalMaterialCost.divide(order.getQuantityToProduce(), 2, java.math.RoundingMode.HALF_UP);
                if (unitProductionCost.compareTo(java.math.BigDecimal.ZERO) > 0) {
                    finishedGood.setPurchasePrice(unitProductionCost);
                }
            }
            productRepository.save(finishedGood);

            // Create Stock audit entry for finished product addition
            try {
                com.example.otpauth.model.Stock fgStock = new com.example.otpauth.model.Stock();
                fgStock.setUserId(userId);
                fgStock.setProductId(finishedGood.getId());
                fgStock.setProductName(finishedGood.getName());
                fgStock.setProductSku(finishedGood.getSku());
                fgStock.setProductCategory(finishedGood.getCategory());
                fgStock.setQuantity(multiplier);
                fgStock.setWarehouse(finishedGood.getWarehouse() != null ? finishedGood.getWarehouse() : "Factory Main Warehouse");
                fgStock.setStore(finishedGood.getStore() != null ? finishedGood.getStore() : "Finished Goods Depot");
                fgStock.setResponsiblePerson("Manufacturing (WO: " + order.getOrderNumber() + ")");
                fgStock.setDate(java.time.LocalDate.now());
                if (finishedGood.getImages() != null && !finishedGood.getImages().isEmpty()) {
                    fgStock.setProductImg(finishedGood.getImages().split(",")[0].trim());
                }
                stockRepository.save(fgStock);
            } catch (Exception ignored) {}
        }

        return workOrderRepository.save(order);
    }

    @Transactional
    public void deleteWorkOrder(Long id, Long userId) {
        WorkOrder order = workOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work Order not found"));
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if ("COMPLETED".equals(order.getStatus())) {
            throw new RuntimeException("Completed work orders cannot be deleted");
        }
        workOrderRepository.delete(order);
    }
}

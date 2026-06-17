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
            
            // 1. Deduct Ingredients
            int multiplier = order.getQuantityToProduce().intValue();
            for (BomItem item : order.getBillOfMaterial().getItems()) {
                Product ingredient = item.getIngredient();
                int deductQty = item.getQuantityRequired().intValue() * multiplier;
                ingredient.setQuantity(Math.max(0, ingredient.getQuantity() - deductQty));
                productRepository.save(ingredient);
            }

            // 2. Add Finished Good
            Product finishedGood = order.getProduct();
            finishedGood.setQuantity(finishedGood.getQuantity() + multiplier);
            productRepository.save(finishedGood);
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
        if (!"DRAFT".equals(order.getStatus())) {
            throw new RuntimeException("Only DRAFT work orders can be deleted");
        }
        workOrderRepository.delete(order);
    }
}

package com.example.otpauth.service;

import com.example.otpauth.dto.BillOfMaterialDTO;
import com.example.otpauth.model.BillOfMaterial;
import com.example.otpauth.model.BomItem;
import com.example.otpauth.model.Product;
import com.example.otpauth.repository.BillOfMaterialRepository;
import com.example.otpauth.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BomService {

    @Autowired
    private BillOfMaterialRepository bomRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<BillOfMaterial> getBomsByUserId(Long userId) {
        return bomRepository.findByUserId(userId);
    }

    @Transactional
    public BillOfMaterial createBom(Long userId, BillOfMaterialDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        BillOfMaterial bom = new BillOfMaterial();
        bom.setUserId(userId);
        bom.setProduct(product);
        bom.setName(dto.getName());

        if (dto.getItems() != null) {
            for (BillOfMaterialDTO.BomItemDTO itemDto : dto.getItems()) {
                Product ingredient = productRepository.findById(itemDto.getIngredientId())
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));

                BomItem item = new BomItem();
                item.setIngredient(ingredient);
                item.setQuantityRequired(itemDto.getQuantityRequired());
                bom.addItem(item);
            }
        }

        return bomRepository.save(bom);
    }

    public void deleteBom(Long id, Long userId) {
        BillOfMaterial bom = bomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BOM not found"));
        if (!bom.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        bomRepository.delete(bom);
    }

    @Transactional
    public BillOfMaterial updateBom(Long id, Long userId, BillOfMaterialDTO dto) {
        BillOfMaterial bom = bomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BOM not found"));
        if (!bom.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        bom.setProduct(product);
        bom.setName(dto.getName());
        
        bom.getItems().clear();

        if (dto.getItems() != null) {
            for (BillOfMaterialDTO.BomItemDTO itemDto : dto.getItems()) {
                Product ingredient = productRepository.findById(itemDto.getIngredientId())
                        .orElseThrow(() -> new RuntimeException("Ingredient not found"));

                BomItem item = new BomItem();
                item.setIngredient(ingredient);
                item.setQuantityRequired(itemDto.getQuantityRequired());
                bom.addItem(item);
            }
        }
        return bomRepository.save(bom);
    }
}

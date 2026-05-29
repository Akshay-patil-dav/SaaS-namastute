package com.example.otpauth.service;

import com.example.otpauth.dto.BrandRequest;
import com.example.otpauth.model.Brand;
import com.example.otpauth.repository.BrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Brand createBrand(BrandRequest request) {
        Brand brand = new Brand();
        brand.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        brand.setName(request.getName());
        brand.setDesc(request.getDesc());
        brand.setImg(request.getImg());
        brand.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return brandRepository.save(brand);
    }

    public Optional<Brand> updateBrand(Long id, BrandRequest request) {
        return brandRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(brand -> {
            brand.setName(request.getName());
            if (request.getDesc() != null) {
                brand.setDesc(request.getDesc());
            }
            if (request.getImg() != null) {
                brand.setImg(request.getImg());
            }
            if (request.getStatus() != null) {
                brand.setStatus(request.getStatus());
            }
            return brandRepository.save(brand);
        });
    }

    public boolean deleteBrand(Long id) {
        if (brandRepository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            brandRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteBrands(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<Brand> brands = brandRepository.findAllById(ids);
        brands.removeIf(b -> !b.getUserId().equals(userId));
        brandRepository.deleteAll(brands);
    }
}

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
        return brandRepository.findAll();
    }

    public Brand createBrand(BrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDesc(request.getDesc());
        brand.setImg(request.getImg());
        brand.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return brandRepository.save(brand);
    }

    public Optional<Brand> updateBrand(Long id, BrandRequest request) {
        return brandRepository.findById(id).map(brand -> {
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
        if (brandRepository.existsById(id)) {
            brandRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteBrands(List<Long> ids) {
        brandRepository.deleteAllById(ids);
    }
}

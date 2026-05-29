package com.example.otpauth.service;

import com.example.otpauth.dto.UnitRequest;
import com.example.otpauth.model.Unit;
import com.example.otpauth.repository.UnitRepository;
import com.example.otpauth.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UnitService {

    private final UnitRepository unitRepository;
    private final ProductRepository productRepository;

    public UnitService(UnitRepository unitRepository, ProductRepository productRepository) {
        this.unitRepository = unitRepository;
        this.productRepository = productRepository;
    }

    public List<Unit> getAllUnits() {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<Unit> units = unitRepository.findByUserId(userId);
        units.forEach(unit -> {
            unit.setProducts(productRepository.countByUnitAndUserId(unit.getName(), userId));
        });
        return units;
    }

    public Unit createUnit(UnitRequest request) {
        Unit unit = new Unit();
        unit.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        unit.setName(request.getName());
        unit.setShortName(request.getShortName());
        unit.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return unitRepository.save(unit);
    }

    public Optional<Unit> updateUnit(Long id, UnitRequest request) {
        return unitRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(existing -> {
            existing.setName(request.getName());
            existing.setShortName(request.getShortName());
            if (request.getStatus() != null) {
                existing.setStatus(request.getStatus());
            }
            return unitRepository.save(existing);
        });
    }

    public boolean deleteUnit(Long id) {
        if (unitRepository.existsByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            unitRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteUnits(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<Unit> units = unitRepository.findAllById(ids);
        units.removeIf(u -> !u.getUserId().equals(userId));
        unitRepository.deleteAll(units);
    }
}

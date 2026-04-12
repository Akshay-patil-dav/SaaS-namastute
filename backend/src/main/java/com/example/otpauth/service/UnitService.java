package com.example.otpauth.service;

import com.example.otpauth.dto.UnitRequest;
import com.example.otpauth.model.Unit;
import com.example.otpauth.repository.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UnitService {

    private final UnitRepository unitRepository;

    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    public List<Unit> getAllUnits() {
        return unitRepository.findAll();
    }

    public Unit createUnit(UnitRequest request) {
        Unit unit = new Unit();
        unit.setName(request.getName());
        unit.setShortName(request.getShortName());
        unit.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return unitRepository.save(unit);
    }

    public Optional<Unit> updateUnit(Long id, UnitRequest request) {
        return unitRepository.findById(id).map(existing -> {
            existing.setName(request.getName());
            existing.setShortName(request.getShortName());
            if (request.getStatus() != null) {
                existing.setStatus(request.getStatus());
            }
            return unitRepository.save(existing);
        });
    }

    public boolean deleteUnit(Long id) {
        if (unitRepository.existsById(id)) {
            unitRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteUnits(List<Long> ids) {
        unitRepository.deleteAllById(ids);
    }
}

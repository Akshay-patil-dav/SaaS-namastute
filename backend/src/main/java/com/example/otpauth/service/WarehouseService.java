package com.example.otpauth.service;

import com.example.otpauth.dto.WarehouseRequest;
import com.example.otpauth.model.Warehouse;
import com.example.otpauth.repository.WarehouseRepository;
import com.example.otpauth.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public List<Warehouse> getAllWarehouses() {
        Long userId = SecurityUtils.getCurrentUserId();
        return warehouseRepository.findByUserIdOrderByIdDesc(userId);
    }

    public Warehouse createWarehouse(WarehouseRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Warehouse warehouse = new Warehouse();
        warehouse.setUserId(userId);
        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return warehouseRepository.save(warehouse);
    }

    public Optional<Warehouse> updateWarehouse(Long id, WarehouseRequest request) {
        return warehouseRepository.findById(id).map(warehouse -> {
            warehouse.setName(request.getName());
            warehouse.setLocation(request.getLocation());
            if (request.getStatus() != null) {
                warehouse.setStatus(request.getStatus());
            }
            return warehouseRepository.save(warehouse);
        });
    }

    public boolean deleteWarehouse(Long id) {
        if (warehouseRepository.existsById(id)) {
            warehouseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteWarehouses(List<Long> ids) {
        warehouseRepository.deleteAllById(ids);
    }
}

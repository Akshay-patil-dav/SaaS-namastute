package com.example.otpauth.service;

import com.example.otpauth.dto.WarrantyRequest;
import com.example.otpauth.model.Warranty;
import com.example.otpauth.repository.WarrantyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WarrantyService {

    private static final Logger logger = LoggerFactory.getLogger(WarrantyService.class);
    private final WarrantyRepository warrantyRepository;

    public WarrantyService(WarrantyRepository warrantyRepository) {
        this.warrantyRepository = warrantyRepository;
    }

    public List<Warranty> getAllWarranties() {
        return warrantyRepository.findAllByOrderByIdDesc();
    }

    public Warranty createWarranty(WarrantyRequest request) {
        Warranty warranty = new Warranty();
        warranty.setName(request.getName());
        warranty.setDescription(request.getDescription());
        warranty.setDuration(request.getDuration());
        warranty.setStatus(request.getStatus() != null ? request.getStatus() : true);
        logger.info("Service: Saving new warranty entity: {}", warranty.getName());
        return warrantyRepository.save(warranty);
    }

    public Optional<Warranty> updateWarranty(Long id, WarrantyRequest request) {
        return warrantyRepository.findById(id).map(existing -> {
            existing.setName(request.getName());
            existing.setDescription(request.getDescription());
            existing.setDuration(request.getDuration());
            if (request.getStatus() != null) {
                existing.setStatus(request.getStatus());
            }
            logger.info("Service: Updating warranty entity ID {}: {}", id, existing.getName());
            return warrantyRepository.save(existing);
        });
    }

    public boolean deleteWarranty(Long id) {
        if (warrantyRepository.existsById(id)) {
            warrantyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public void bulkDeleteWarranties(List<Long> ids) {
        warrantyRepository.deleteAllById(ids);
    }
}

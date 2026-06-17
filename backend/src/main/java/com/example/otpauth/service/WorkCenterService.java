package com.example.otpauth.service;

import com.example.otpauth.model.WorkCenter;
import com.example.otpauth.repository.WorkCenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkCenterService {

    @Autowired
    private WorkCenterRepository workCenterRepository;

    public List<WorkCenter> getWorkCentersByUserId(Long userId) {
        return workCenterRepository.findByUserId(userId);
    }

    public WorkCenter createWorkCenter(Long userId, WorkCenter workCenter) {
        workCenter.setUserId(userId);
        return workCenterRepository.save(workCenter);
    }

    public WorkCenter updateWorkCenter(Long id, Long userId, WorkCenter updatedWorkCenter) {
        WorkCenter existing = workCenterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work Center not found"));
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        existing.setName(updatedWorkCenter.getName());
        existing.setDescription(updatedWorkCenter.getDescription());
        existing.setCostPerHour(updatedWorkCenter.getCostPerHour());
        return workCenterRepository.save(existing);
    }

    public void deleteWorkCenter(Long id, Long userId) {
        WorkCenter existing = workCenterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Work Center not found"));
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        workCenterRepository.delete(existing);
    }
}

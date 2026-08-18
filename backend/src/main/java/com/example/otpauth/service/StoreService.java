package com.example.otpauth.service;

import com.example.otpauth.dto.StoreRequest;
import com.example.otpauth.model.Store;
import com.example.otpauth.repository.StoreRepository;
import com.example.otpauth.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    private final StoreRepository storeRepository;

    public StoreService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    public List<Store> getAllStores() {
        Long userId = SecurityUtils.getCurrentUserId();
        return storeRepository.findByUserIdOrderByIdDesc(userId);
    }

    public Store createStore(StoreRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Store store = new Store();
        store.setUserId(userId);
        store.setName(request.getName());
        store.setLocation(request.getLocation());
        store.setStatus(request.getStatus() != null ? request.getStatus() : true);
        return storeRepository.save(store);
    }

    public Optional<Store> updateStore(Long id, StoreRequest request) {
        return storeRepository.findById(id).map(store -> {
            store.setName(request.getName());
            store.setLocation(request.getLocation());
            if (request.getStatus() != null) {
                store.setStatus(request.getStatus());
            }
            return storeRepository.save(store);
        });
    }

    public boolean deleteStore(Long id) {
        if (storeRepository.existsById(id)) {
            storeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteStores(List<Long> ids) {
        storeRepository.deleteAllById(ids);
    }
}

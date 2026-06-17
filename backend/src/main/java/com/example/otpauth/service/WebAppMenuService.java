package com.example.otpauth.service;

import com.example.otpauth.dto.WebAppMenuRequest;
import com.example.otpauth.model.WebAppMenu;
import com.example.otpauth.repository.WebAppMenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WebAppMenuService {

    @Autowired
    private WebAppMenuRepository webAppMenuRepository;

    public List<WebAppMenu> getAllMenus() {
        return webAppMenuRepository.findByUserIdOrderByIdDesc(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<WebAppMenu> getMenuById(Long id) {
        return webAppMenuRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public WebAppMenu createMenu(WebAppMenuRequest request) {
        WebAppMenu menu = new WebAppMenu();
        menu.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        menu.setName(request.getName());
        menu.setItemsJson(request.getItemsJson());
        return webAppMenuRepository.save(menu);
    }

    public Optional<WebAppMenu> updateMenu(Long id, WebAppMenuRequest request) {
        return webAppMenuRepository.findByIdAndUserId(id, com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(menu -> {
            menu.setName(request.getName());
            if (request.getItemsJson() != null) {
                menu.setItemsJson(request.getItemsJson());
            }
            return webAppMenuRepository.save(menu);
        });
    }

    public boolean deleteMenu(Long id) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        Optional<WebAppMenu> menu = webAppMenuRepository.findByIdAndUserId(id, userId);
        if (menu.isPresent()) {
            webAppMenuRepository.delete(menu.get());
            return true;
        }
        return false;
    }

    public void bulkDeleteMenus(List<Long> ids) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        List<WebAppMenu> menus = webAppMenuRepository.findAllById(ids);
        menus.removeIf(m -> !m.getUserId().equals(userId));
        webAppMenuRepository.deleteAll(menus);
    }

    public boolean setAsDefault(Long id) {
        Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
        Optional<WebAppMenu> menuToDefault = webAppMenuRepository.findByIdAndUserId(id, userId);
        if (menuToDefault.isPresent()) {
            List<WebAppMenu> allMenus = webAppMenuRepository.findByUserIdOrderByIdDesc(userId);
            for (WebAppMenu menu : allMenus) {
                menu.setIsDefault(menu.getId().equals(id));
            }
            webAppMenuRepository.saveAll(allMenus);
            return true;
        }
        return false;
    }
}

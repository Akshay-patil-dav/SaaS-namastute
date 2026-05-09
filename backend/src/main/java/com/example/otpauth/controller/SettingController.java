package com.example.otpauth.controller;

import com.example.otpauth.model.Setting;
import com.example.otpauth.repository.SettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    @Autowired
    private SettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<Map<String, String>> getAllSettings() {
        List<Setting> settings = settingRepository.findAll();
        Map<String, String> settingsMap = new HashMap<>();
        for (Setting setting : settings) {
            settingsMap.put(setting.getSettingKey(), setting.getSettingValue());
        }
        return ResponseEntity.ok(settingsMap);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> saveSettings(@RequestBody Map<String, String> settingsToSave) {
        for (Map.Entry<String, String> entry : settingsToSave.entrySet()) {
            Optional<Setting> existingOpt = settingRepository.findBySettingKey(entry.getKey());
            if (existingOpt.isPresent()) {
                Setting existing = existingOpt.get();
                existing.setSettingValue(entry.getValue());
                settingRepository.save(existing);
            } else {
                Setting newSetting = new Setting(entry.getKey(), entry.getValue());
                settingRepository.save(newSetting);
            }
        }
        return ResponseEntity.ok(settingsToSave);
    }

    @GetMapping("/{key}")
    public ResponseEntity<String> getSetting(@PathVariable String key) {
        Optional<Setting> settingOpt = settingRepository.findBySettingKey(key);
        return settingOpt.map(setting -> ResponseEntity.ok(setting.getSettingValue()))
                .orElse(ResponseEntity.notFound().build());
    }
}

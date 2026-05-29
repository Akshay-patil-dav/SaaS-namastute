package com.example.otpauth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "settings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "key"})
})
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    @Column(nullable = false)
    private String settingKey;

    @Column(columnDefinition = "TEXT")
    private String settingValue;

    public Setting() {
    }

    public Setting(String settingKey, String settingValue) {
        this.settingKey = settingKey;
        this.settingValue = settingValue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSettingKey() {
        return settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey;
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }
}

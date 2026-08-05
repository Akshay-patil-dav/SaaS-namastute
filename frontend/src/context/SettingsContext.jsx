import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient, { API } from '../api/config';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        if (!isAuthenticated()) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await apiClient.get(API.SETTINGS);
            setSettings(response.data || {});
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch settings when the user authenticates
    useEffect(() => {
        fetchSettings();
    }, [isAuthenticated()]);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // Apply Dynamic Theme when settings change
    useEffect(() => {
        // Theme Layout (Light/Dark)
        if (settings.themeLayout === 'Dark') {
            document.documentElement.classList.add('dark');
            document.body.classList.add('theme-dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('theme-dark');
        }

        // Primary Color Override
        if (settings.primaryColor) {
            let styleEl = document.getElementById('dynamic-theme-style');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'dynamic-theme-style';
                document.head.appendChild(styleEl);
            }
            
            // Apply standard primary color and a lighter version for hovers/shadows
            const hex = settings.primaryColor;
            // Calculate a simple hover color (slightly darker or transparent)
            const r = parseInt(hex.slice(1, 3), 16) || 0;
            const g = parseInt(hex.slice(3, 5), 16) || 0;
            const b = parseInt(hex.slice(5, 7), 16) || 0;
            
            styleEl.innerHTML = `
                :root {
                    --primary-color: ${settings.primaryColor} !important;
                    --primary-hover: rgba(${r}, ${g}, ${b}, 0.8) !important;
                    --primary-light: rgba(${r}, ${g}, ${b}, 0.15) !important;
                }
            `;
        }
    }, [settings.themeLayout, settings.primaryColor]);

    const saveSettings = async (keysToSave, directData = null) => {
        try {
            setSaving(true);
            let dataToSave;
            if (directData) {
                dataToSave = directData;
            } else if (keysToSave && Array.isArray(keysToSave)) {
                dataToSave = {};
                keysToSave.forEach(key => {
                    if (settings[key] !== undefined) {
                        dataToSave[key] = settings[key];
                    }
                });
            } else {
                dataToSave = settings;
            }

            await apiClient.post(API.SETTINGS, dataToSave);
            // Re-fetch to ensure UI is in sync with database
            await fetchSettings();
            return { success: true };
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
            return { success: false };
        } finally {
            setSaving(false);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, saving, handleChange, saveSettings, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = () => useContext(SettingsContext);

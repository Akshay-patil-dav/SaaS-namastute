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

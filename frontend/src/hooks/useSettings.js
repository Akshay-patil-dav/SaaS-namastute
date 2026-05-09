import { useState, useEffect } from 'react';
import apiClient, { API } from '../api/config';

export const useSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
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

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    /**
     * Save settings to the backend.
     * @param {string[]} [keysToSave] - Only save these keys from current state.
     * @param {object}   [directData] - Pass data directly, bypassing React state (avoids stale-state race conditions).
     */
    const saveSettings = async (keysToSave, directData = null) => {
        try {
            setSaving(true);

            let dataToSave;
            if (directData) {
                // Caller provided the exact payload — use it directly
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
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return { settings, loading, saving, handleChange, saveSettings, fetchSettings };
};

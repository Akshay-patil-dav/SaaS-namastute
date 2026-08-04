import { useSettingsContext } from '../context/SettingsContext';

/**
 * useSettings hook now simply wraps the global SettingsContext.
 * This ensures that when profile data changes in the settings page,
 * it instantly reflects in headers and other parts of the app.
 */
export const useSettings = () => {
    return useSettingsContext();
};

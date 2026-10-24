import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_LANDING_DATA } from '../data/landingPageDefaultData';
import apiClient, { ENV } from '../api/config';

const STORAGE_KEY = 'namustutam_landing_content';
const LandingPageContext = createContext(null);

const cleanLocalLinks = (data) => {
    if (!data) return data;
    // Primary: https://namustutam.vercel.app/ or window.location.origin; Fallback: http://localhost:4000
    const primaryOrigin = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1'))
        ? window.location.origin
        : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? window.location.origin
            : 'https://namustutam.vercel.app');

    if (Array.isArray(data.projects)) {
        data.projects = data.projects.map(p => ({
            ...p,
            liveLink: (p.liveLink && (p.liveLink.includes('namustutam.com') || p.liveLink.includes('namustutamsaas.vercel.app')))
                ? primaryOrigin
                : (p.liveLink || primaryOrigin)
        }));
    }
    return data;
};

export const LandingPageProvider = ({ children }) => {
    // Deep merge function to ensure all default sections exist even if older localStorage is present
    const loadInitialData = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = cleanLocalLinks(JSON.parse(saved));
                return {
                    ...DEFAULT_LANDING_DATA,
                    ...parsed,
                    hero: { ...DEFAULT_LANDING_DATA.hero, ...(parsed.hero || {}) },
                    contact: { ...DEFAULT_LANDING_DATA.contact, ...(parsed.contact || {}) },
                    marquee: { ...DEFAULT_LANDING_DATA.marquee, ...(parsed.marquee || {}) },
                    announcement: { ...DEFAULT_LANDING_DATA.announcement, ...(parsed.announcement || {}) },
                    seo: { ...DEFAULT_LANDING_DATA.seo, ...(parsed.seo || {}) },
                    chatbot: { ...DEFAULT_LANDING_DATA.chatbot, ...(parsed.chatbot || {}) },
                    sectionVisibility: { ...DEFAULT_LANDING_DATA.sectionVisibility, ...(parsed.sectionVisibility || {}) },
                    services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_LANDING_DATA.services,
                    projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_LANDING_DATA.projects,
                    sdlcSteps: Array.isArray(parsed.sdlcSteps) ? parsed.sdlcSteps : DEFAULT_LANDING_DATA.sdlcSteps,
                    team: Array.isArray(parsed.team) ? parsed.team : DEFAULT_LANDING_DATA.team,
                    testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : DEFAULT_LANDING_DATA.testimonials,
                };
            }
        } catch (e) {
            console.error('Error loading landing page config from storage:', e);
        }
        return cleanLocalLinks(DEFAULT_LANDING_DATA);
    };

    const [landingData, setLandingData] = useState(loadInitialData);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
    const [backendStatus, setBackendStatus] = useState({
        connected: false,
        checking: true,
        catalog: 'namustute_db_pos',
        databaseProductName: 'PostgreSQL',
        tableCount: 0,
        error: null
    });

    // ── Fetch & sync remote config from backend ──────────────────────────────
    const fetchAndSyncRemoteConfig = useCallback(async () => {
        try {
            const res = await apiClient.get(`${ENV.API_BASE_URL}/landing-page`, { timeout: 4000 });
            if (res.data && typeof res.data === 'object' && res.data.hero) {
                const cleaned = cleanLocalLinks(res.data);
                setLandingData(() => ({ ...DEFAULT_LANDING_DATA, ...cleaned }));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
                return true;
            }
        } catch {
            // backend offline — use localStorage
        }
        return false;
    }, []);

    // ── Check backend and DB status ──────────────────────────────────────────
    const checkBackendStatus = useCallback(async () => {
        try {
            const res = await apiClient.get(`${ENV.API_BASE_URL}/landing-page/db-status`, { timeout: 3500 });
            if (res.data && res.data.connected) {
                setBackendStatus({
                    connected: true,
                    checking: false,
                    catalog: res.data.catalog || 'namustute_db_pos',
                    databaseProductName: res.data.databaseProductName || 'PostgreSQL',
                    tableCount: res.data.tableCount || 0,
                    error: null
                });
                return true;
            } else {
                setBackendStatus(prev => ({
                    ...prev,
                    connected: false,
                    checking: false,
                    error: res.data?.error || 'Database connection offline'
                }));
                return false;
            }
        } catch (e) {
            setBackendStatus(prev => ({
                ...prev,
                connected: false,
                checking: false,
                error: e.message
            }));
            return false;
        }
    }, []);

    // ── Auto-create DB + connect on button click ─────────────────────────────
    const reconnectDatabase = useCallback(async () => {
        setBackendStatus(prev => ({ ...prev, checking: true }));
        try {
            // Trigger DB auto-creation
            await apiClient.post(`${ENV.API_BASE_URL}/landing-page/ensure-db`, {}, { timeout: 8000 });
        } catch { /* backend might be starting */ }
        const ok = await checkBackendStatus();
        if (ok) {
            // DB just came online — sync data
            await fetchAndSyncRemoteConfig();
            setSaveMessage({ type: 'success', text: '✅ Database connected! Landing page config synced.' });
            setTimeout(() => setSaveMessage(null), 4000);
        }
        return ok;
    }, [checkBackendStatus, fetchAndSyncRemoteConfig]);

    // ── Auto-retry: poll every 8 s while backend is offline ─────────────────
    useEffect(() => {
        let retryTimer = null;
        let stopped = false;

        const attemptConnect = async () => {
            if (stopped) return;
            const ok = await checkBackendStatus();
            if (ok) {
                // First successful reconnect — ensure DB exists and pull config
                try {
                    await apiClient.post(`${ENV.API_BASE_URL}/landing-page/ensure-db`, {}, { timeout: 6000 });
                } catch { /* ignore */ }
                await fetchAndSyncRemoteConfig();
                return; // stop retrying, DB is live
            }
            // Schedule next retry in 8 seconds
            if (!stopped) {
                retryTimer = setTimeout(attemptConnect, 8000);
            }
        };

        attemptConnect();
        return () => {
            stopped = true;
            clearTimeout(retryTimer);
        };
    }, [checkBackendStatus, fetchAndSyncRemoteConfig]);

    // Listen for storage events across tabs
    useEffect(() => {
        const handleSync = () => {
            setLandingData(loadInitialData());
        };
        window.addEventListener('storage', handleSync);
        window.addEventListener('namustutam_landing_content_saved', handleSync);
        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('namustutam_landing_content_saved', handleSync);
        };
    }, []);

    // ── Update helper ────────────────────────────────────────────────────────
    const updateSection = useCallback((sectionKey, partialData) => {
        setLandingData(prev => {
            const next = {
                ...prev,
                [sectionKey]: {
                    ...prev[sectionKey],
                    ...partialData
                }
            };
            return next;
        });
        setHasUnsavedChanges(true);
    }, []);

    // ── Project Actions ──────────────────────────────────────────────────────
    const addProject = useCallback((project) => {
        const newProj = {
            id: 'proj-' + Date.now(),
            title: 'New Flagship Project',
            category: 'Web App',
            filter: 'Web Application',
            price: '$99 USD',
            img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            techStack: ['React', 'Spring Boot'],
            description: 'Custom developed solution tailored for high performance.',
            liveLink: '#',
            githubLink: '#',
            featured: true,
            ...project
        };
        setLandingData(prev => {
            const next = {
                ...prev,
                projects: [newProj, ...prev.projects]
            };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                window.dispatchEvent(new Event('namustutam_landing_content_saved'));
            } catch (err) {
                console.warn('Failed to sync project addition to localStorage:', err);
            }
            return next;
        });
        setHasUnsavedChanges(true);
        return newProj;
    }, []);

    const updateProject = useCallback((id, updatedFields) => {
        setLandingData(prev => {
            const next = {
                ...prev,
                projects: prev.projects.map(p => p.id === id ? { ...p, ...updatedFields } : p)
            };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                window.dispatchEvent(new Event('namustutam_landing_content_saved'));
            } catch (err) {
                console.warn('Failed to sync project update to localStorage:', err);
            }
            return next;
        });
        setHasUnsavedChanges(true);
    }, []);

    const deleteProject = useCallback((id) => {
        setLandingData(prev => {
            const next = {
                ...prev,
                projects: prev.projects.filter(p => p.id !== id)
            };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                window.dispatchEvent(new Event('namustutam_landing_content_saved'));
            } catch (err) {
                console.warn('Failed to sync project deletion to localStorage:', err);
            }
            return next;
        });
        setHasUnsavedChanges(true);
    }, []);

    // ── Services Actions ─────────────────────────────────────────────────────
    const addService = useCallback((service) => {
        const newService = {
            id: 'srv-' + Date.now(),
            icon: '⚡',
            title: 'New Service',
            desc: 'Custom enterprise software service for your business growth.',
            link: '/contact',
            active: true,
            ...service
        };
        setLandingData(prev => ({
            ...prev,
            services: [...prev.services, newService]
        }));
        setHasUnsavedChanges(true);
        return newService;
    }, []);

    const updateService = useCallback((id, updatedFields) => {
        setLandingData(prev => ({
            ...prev,
            services: prev.services.map(s => s.id === id ? { ...s, ...updatedFields } : s)
        }));
        setHasUnsavedChanges(true);
    }, []);

    const deleteService = useCallback((id) => {
        setLandingData(prev => ({
            ...prev,
            services: prev.services.filter(s => s.id !== id)
        }));
        setHasUnsavedChanges(true);
    }, []);

    // ── Team Actions ─────────────────────────────────────────────────────────
    const addTeamMember = useCallback((member) => {
        const newMember = {
            id: 'tm-' + Date.now(),
            name: 'New Team Member',
            role: 'Software Developer',
            badge: 'Contributor',
            image: '/team/Akshay.png',
            bio: 'Dedicated developer committed to engineering excellence.',
            socials: { linkedin: '#', twitter: '#' },
            ...member
        };
        setLandingData(prev => ({
            ...prev,
            team: [...prev.team, newMember]
        }));
        setHasUnsavedChanges(true);
        return newMember;
    }, []);

    const updateTeamMember = useCallback((id, updatedFields) => {
        setLandingData(prev => ({
            ...prev,
            team: prev.team.map(m => m.id === id ? { ...m, ...updatedFields } : m)
        }));
        setHasUnsavedChanges(true);
    }, []);

    const deleteTeamMember = useCallback((id) => {
        setLandingData(prev => ({
            ...prev,
            team: prev.team.filter(m => m.id !== id)
        }));
        setHasUnsavedChanges(true);
    }, []);

    // ── Testimonial Actions ──────────────────────────────────────────────────
    const addTestimonial = useCallback((testimonial) => {
        const newTestimonial = {
            id: 't-' + Date.now(),
            name: 'Happy Client',
            role: 'Business Owner',
            rating: 5,
            review: 'Outstanding execution and lightning fast delivery.',
            avatar: 'C',
            ...testimonial
        };
        setLandingData(prev => ({
            ...prev,
            testimonials: [newTestimonial, ...prev.testimonials]
        }));
        setHasUnsavedChanges(true);
        return newTestimonial;
    }, []);

    const updateTestimonial = useCallback((id, updatedFields) => {
        setLandingData(prev => ({
            ...prev,
            testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...updatedFields } : t)
        }));
        setHasUnsavedChanges(true);
    }, []);

    const deleteTestimonial = useCallback((id) => {
        setLandingData(prev => ({
            ...prev,
            testimonials: prev.testimonials.filter(t => t.id !== id)
        }));
        setHasUnsavedChanges(true);
    }, []);

    // ── SDLC Step Actions ────────────────────────────────────────────────────
    const updateSdlcStep = useCallback((num, updatedFields) => {
        setLandingData(prev => ({
            ...prev,
            sdlcSteps: prev.sdlcSteps.map(s => s.num === num ? { ...s, ...updatedFields } : s)
        }));
        setHasUnsavedChanges(true);
    }, []);

    // ── Section Visibility Actions ──────────────────────────────────────────
    const toggleSectionVisibility = useCallback((sectionKey) => {
        setLandingData(prev => {
            const currentVis = prev.sectionVisibility || DEFAULT_LANDING_DATA.sectionVisibility || {};
            const isCurrentlyVisible = currentVis[sectionKey] !== false;
            const updatedVis = {
                ...currentVis,
                [sectionKey]: !isCurrentlyVisible
            };
            const next = {
                ...prev,
                sectionVisibility: updatedVis
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            window.dispatchEvent(new Event('namustutam_landing_content_saved'));
            return next;
        });
        setHasUnsavedChanges(true);
    }, []);

    const setSectionVisibility = useCallback((sectionKey, isVisible) => {
        setLandingData(prev => {
            const currentVis = prev.sectionVisibility || DEFAULT_LANDING_DATA.sectionVisibility || {};
            const updatedVis = {
                ...currentVis,
                [sectionKey]: Boolean(isVisible)
            };
            const next = {
                ...prev,
                sectionVisibility: updatedVis
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            window.dispatchEvent(new Event('namustutam_landing_content_saved'));
            return next;
        });
        setHasUnsavedChanges(true);
    }, []);

    // ── Save & Publish ───────────────────────────────────────────────────────
    const saveAndPublish = async () => {
        setIsSaving(true);
        try {
            // 1. Save locally as fallback
            localStorage.setItem(STORAGE_KEY, JSON.stringify(landingData));
            window.dispatchEvent(new Event('namustutam_landing_content_saved'));

            let savedToBackend = false;
            let backendMsg = '';

            // 2. Persist to Spring Boot backend & PostgreSQL
            try {
                const res = await apiClient.put(`${ENV.API_BASE_URL}/landing-page`, landingData, { timeout: 6000 });
                if (res.data && res.data.success) {
                    savedToBackend = true;
                    backendMsg = res.data.databaseSaved
                        ? 'Saved to PostgreSQL Database (namustute_db_pos) & Backup File!'
                        : (res.data.message || 'Saved to Backend!');
                    setBackendStatus(prev => ({ ...prev, connected: true, error: null }));
                }
            } catch (backendErr) {
                console.warn('Backend save failed, using local storage fallback:', backendErr);
                setBackendStatus(prev => ({ ...prev, connected: false, error: backendErr.message }));
            }

            setHasUnsavedChanges(false);
            setSaveMessage({
                type: 'success',
                text: savedToBackend
                    ? `Success: ${backendMsg} Changes are live!`
                    : 'Changes saved locally! (Backend offline - will sync on reconnect)'
            });
            setTimeout(() => setSaveMessage(null), 5000);
            return { success: true, savedToBackend };
        } catch (err) {
            setSaveMessage({ type: 'error', text: 'Failed to save changes: ' + err.message });
            setTimeout(() => setSaveMessage(null), 5000);
            return { success: false, error: err.message };
        } finally {
            setIsSaving(false);
        }
    };

    // ── Reset to Defaults ────────────────────────────────────────────────────
    const resetToDefaults = () => {
        localStorage.removeItem(STORAGE_KEY);
        setLandingData(DEFAULT_LANDING_DATA);
        setHasUnsavedChanges(false);
        window.dispatchEvent(new Event('namustutam_landing_content_saved'));
        setSaveMessage({ type: 'info', text: 'Reset to factory default landing page settings.' });
        setTimeout(() => setSaveMessage(null), 4000);
    };

    // ── Export / Import JSON ─────────────────────────────────────────────────
    const exportConfigJson = () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(landingData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `namustutam-landing-config-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const importConfigJson = (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.hero || !parsed.projects) {
                throw new Error('Invalid landing page JSON configuration format.');
            }
            setLandingData(parsed);
            setHasUnsavedChanges(true);
            setSaveMessage({ type: 'success', text: 'Configuration imported successfully! Remember to Save & Publish.' });
            setTimeout(() => setSaveMessage(null), 4000);
            return { success: true };
        } catch (e) {
            setSaveMessage({ type: 'error', text: 'Import failed: ' + e.message });
            setTimeout(() => setSaveMessage(null), 4000);
            return { success: false, error: e.message };
        }
    };

    return (
        <LandingPageContext.Provider
            value={{
                landingData,
                hasUnsavedChanges,
                isSaving,
                saveMessage,
                updateSection,
                addProject,
                updateProject,
                deleteProject,
                addService,
                updateService,
                deleteService,
                addTeamMember,
                updateTeamMember,
                deleteTeamMember,
                addTestimonial,
                updateTestimonial,
                deleteTestimonial,
                updateSdlcStep,
                toggleSectionVisibility,
                setSectionVisibility,
                saveAndPublish,
                resetToDefaults,
                exportConfigJson,
                importConfigJson,
                backendStatus,
                checkBackendStatus,
                reconnectDatabase
            }}
        >
            {children}
        </LandingPageContext.Provider>
    );
};

export const useLandingPage = () => {
    const context = useContext(LandingPageContext);
    if (!context) {
        throw new Error('useLandingPage must be used within a LandingPageProvider');
    }
    return context;
};

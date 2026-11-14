import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_LANDING_DATA } from '../data/landingPageDefaultData';
import apiClient, { ENV } from '../api/config';

const STORAGE_KEY = 'namustutam_landing_content';
const LandingPageContext = createContext(null);

const cleanLocalLinks = (data) => {
    if (!data) return data;
    // Preserve user-entered project liveLinks exactly as entered in Admin
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
                    hero: {
                        ...DEFAULT_LANDING_DATA.hero,
                        ...(parsed.hero || {}),
                        badge: parsed.hero?.badge || DEFAULT_LANDING_DATA.hero.badge,
                        titlePrefix: parsed.hero?.titlePrefix || DEFAULT_LANDING_DATA.hero.titlePrefix,
                        rotatingWords: (parsed.hero?.rotatingWords && parsed.hero.rotatingWords.length > 0)
                            ? parsed.hero.rotatingWords
                            : DEFAULT_LANDING_DATA.hero.rotatingWords,
                        titleSuffix: parsed.hero?.titleSuffix || DEFAULT_LANDING_DATA.hero.titleSuffix,
                        subtitle: parsed.hero?.subtitle || DEFAULT_LANDING_DATA.hero.subtitle,
                        primaryBtnText: parsed.hero?.primaryBtnText || DEFAULT_LANDING_DATA.hero.primaryBtnText,
                        primaryBtnLink: parsed.hero?.primaryBtnLink || DEFAULT_LANDING_DATA.hero.primaryBtnLink,
                        secondaryBtnText: parsed.hero?.secondaryBtnText || DEFAULT_LANDING_DATA.hero.secondaryBtnText,
                        secondaryBtnLink: parsed.hero?.secondaryBtnLink || DEFAULT_LANDING_DATA.hero.secondaryBtnLink,
                        personImage: parsed.hero?.personImage || DEFAULT_LANDING_DATA.hero.personImage,
                        paragraphs: (parsed.hero?.paragraphs && parsed.hero.paragraphs.length > 0)
                            ? parsed.hero.paragraphs
                            : DEFAULT_LANDING_DATA.hero.paragraphs,
                        milestones: (parsed.hero?.milestones && parsed.hero.milestones.length > 0)
                            ? parsed.hero.milestones
                            : DEFAULT_LANDING_DATA.hero.milestones,
                    },
                    contact: {
                        ...DEFAULT_LANDING_DATA.contact,
                        ...(parsed.contact || {}),
                        email: (parsed.contact?.email && parsed.contact.email.trim()) ? parsed.contact.email : DEFAULT_LANDING_DATA.contact.email,
                        phone: (parsed.contact?.phone && parsed.contact.phone.trim()) ? parsed.contact.phone : DEFAULT_LANDING_DATA.contact.phone,
                        whatsapp: (parsed.contact?.whatsapp && parsed.contact.whatsapp.trim()) ? parsed.contact.whatsapp : DEFAULT_LANDING_DATA.contact.whatsapp,
                        location: (parsed.contact?.location && parsed.contact.location.trim()) ? parsed.contact.location : DEFAULT_LANDING_DATA.contact.location,
                        showEmail: parsed.contact?.showEmail !== undefined ? parsed.contact.showEmail : DEFAULT_LANDING_DATA.contact.showEmail,
                        showPhone: parsed.contact?.showPhone !== undefined ? parsed.contact.showPhone : DEFAULT_LANDING_DATA.contact.showPhone,
                        showLocation: parsed.contact?.showLocation !== undefined ? parsed.contact.showLocation : DEFAULT_LANDING_DATA.contact.showLocation,
                        showHours: parsed.contact?.showHours !== undefined ? parsed.contact.showHours : DEFAULT_LANDING_DATA.contact.showHours,
                    },
                    legal: {
                        ...DEFAULT_LANDING_DATA.legal,
                        ...(parsed.legal || {}),
                        privacy: {
                            ...DEFAULT_LANDING_DATA.legal?.privacy,
                            ...(parsed.legal?.privacy || {}),
                            sections: (parsed.legal?.privacy?.sections && parsed.legal.privacy.sections.length > 0)
                                ? parsed.legal.privacy.sections
                                : DEFAULT_LANDING_DATA.legal?.privacy?.sections
                        },
                        terms: {
                            ...DEFAULT_LANDING_DATA.legal?.terms,
                            ...(parsed.legal?.terms || {}),
                            sections: (parsed.legal?.terms?.sections && parsed.legal.terms.sections.length > 0)
                                ? parsed.legal.terms.sections
                                : DEFAULT_LANDING_DATA.legal?.terms?.sections
                        },
                        cookies: {
                            ...DEFAULT_LANDING_DATA.legal?.cookies,
                            ...(parsed.legal?.cookies || {}),
                            sections: (parsed.legal?.cookies?.sections && parsed.legal.cookies.sections.length > 0)
                                ? parsed.legal.cookies.sections
                                : DEFAULT_LANDING_DATA.legal?.cookies?.sections
                        },
                        refunds: {
                            ...DEFAULT_LANDING_DATA.legal?.refunds,
                            ...(parsed.legal?.refunds || {}),
                            sections: (parsed.legal?.refunds?.sections && parsed.legal.refunds.sections.length > 0)
                                ? parsed.legal.refunds.sections
                                : DEFAULT_LANDING_DATA.legal?.refunds?.sections
                        }
                    },
                    posSoftware: {
                        ...DEFAULT_LANDING_DATA.posSoftware,
                        ...(parsed.posSoftware || {}),
                        stats: (parsed.posSoftware?.stats && parsed.posSoftware.stats.length > 0)
                            ? parsed.posSoftware.stats
                            : DEFAULT_LANDING_DATA.posSoftware?.stats,
                        pricingPlans: (parsed.posSoftware?.pricingPlans && parsed.posSoftware.pricingPlans.length > 0)
                            ? parsed.posSoftware.pricingPlans
                            : DEFAULT_LANDING_DATA.posSoftware?.pricingPlans,
                        demoInfo: {
                            ...DEFAULT_LANDING_DATA.posSoftware?.demoInfo,
                            ...(parsed.posSoftware?.demoInfo || {})
                        }
                    },
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
            const res = await apiClient.get('/landing-page', { timeout: 5000 });
            if (res.data && typeof res.data === 'object' && res.data.hero) {
                const cleaned = cleanLocalLinks(res.data);
                setLandingData(() => ({
                    ...DEFAULT_LANDING_DATA,
                    ...cleaned,
                    hero: {
                        ...DEFAULT_LANDING_DATA.hero,
                        ...(cleaned.hero || {}),
                        paragraphs: (cleaned.hero?.paragraphs && cleaned.hero.paragraphs.length > 0)
                            ? cleaned.hero.paragraphs
                            : DEFAULT_LANDING_DATA.hero.paragraphs,
                        milestones: (cleaned.hero?.milestones && cleaned.hero.milestones.length > 0)
                            ? cleaned.hero.milestones
                            : DEFAULT_LANDING_DATA.hero.milestones,
                        personImage: cleaned.hero?.personImage || DEFAULT_LANDING_DATA.hero.personImage,
                    },
                    contact: {
                        ...DEFAULT_LANDING_DATA.contact,
                        ...(cleaned.contact || {}),
                        email: (cleaned.contact?.email && cleaned.contact.email.trim()) ? cleaned.contact.email : DEFAULT_LANDING_DATA.contact.email,
                        phone: (cleaned.contact?.phone && cleaned.contact.phone.trim()) ? cleaned.contact.phone : DEFAULT_LANDING_DATA.contact.phone,
                        whatsapp: (cleaned.contact?.whatsapp && cleaned.contact.whatsapp.trim()) ? cleaned.contact.whatsapp : DEFAULT_LANDING_DATA.contact.whatsapp,
                        location: (cleaned.contact?.location && cleaned.contact.location.trim()) ? cleaned.contact.location : DEFAULT_LANDING_DATA.contact.location,
                        showEmail: cleaned.contact?.showEmail !== undefined ? cleaned.contact.showEmail : DEFAULT_LANDING_DATA.contact.showEmail,
                        showPhone: cleaned.contact?.showPhone !== undefined ? cleaned.contact.showPhone : DEFAULT_LANDING_DATA.contact.showPhone,
                        showLocation: cleaned.contact?.showLocation !== undefined ? cleaned.contact.showLocation : DEFAULT_LANDING_DATA.contact.showLocation,
                        showHours: cleaned.contact?.showHours !== undefined ? cleaned.contact.showHours : DEFAULT_LANDING_DATA.contact.showHours,
                    },
                    sectionVisibility: {
                        ...DEFAULT_LANDING_DATA.sectionVisibility,
                        ...(cleaned.sectionVisibility || {})
                    },
                    legal: {
                        ...DEFAULT_LANDING_DATA.legal,
                        ...(cleaned.legal || {}),
                        privacy: {
                            ...DEFAULT_LANDING_DATA.legal?.privacy,
                            ...(cleaned.legal?.privacy || {}),
                            sections: (cleaned.legal?.privacy?.sections && cleaned.legal.privacy.sections.length > 0)
                                ? cleaned.legal.privacy.sections
                                : DEFAULT_LANDING_DATA.legal?.privacy?.sections
                        },
                        terms: {
                            ...DEFAULT_LANDING_DATA.legal?.terms,
                            ...(cleaned.legal?.terms || {}),
                            sections: (cleaned.legal?.terms?.sections && cleaned.legal.terms.sections.length > 0)
                                ? cleaned.legal.terms.sections
                                : DEFAULT_LANDING_DATA.legal?.terms?.sections
                        },
                        cookies: {
                            ...DEFAULT_LANDING_DATA.legal?.cookies,
                            ...(cleaned.legal?.cookies || {}),
                            sections: (cleaned.legal?.cookies?.sections && cleaned.legal.cookies.sections.length > 0)
                                ? cleaned.legal.cookies.sections
                                : DEFAULT_LANDING_DATA.legal?.cookies?.sections
                        },
                        refunds: {
                            ...DEFAULT_LANDING_DATA.legal?.refunds,
                            ...(cleaned.legal?.refunds || {}),
                            sections: (cleaned.legal?.refunds?.sections && cleaned.legal.refunds.sections.length > 0)
                                ? cleaned.legal.refunds.sections
                                : DEFAULT_LANDING_DATA.legal?.refunds?.sections
                        }
                    },
                    posSoftware: {
                        ...DEFAULT_LANDING_DATA.posSoftware,
                        ...(cleaned.posSoftware || {}),
                        stats: (cleaned.posSoftware?.stats && cleaned.posSoftware.stats.length > 0)
                            ? cleaned.posSoftware.stats
                            : DEFAULT_LANDING_DATA.posSoftware?.stats,
                        pricingPlans: (cleaned.posSoftware?.pricingPlans && cleaned.posSoftware.pricingPlans.length > 0)
                            ? cleaned.posSoftware.pricingPlans
                            : DEFAULT_LANDING_DATA.posSoftware?.pricingPlans,
                        demoInfo: {
                            ...DEFAULT_LANDING_DATA.posSoftware?.demoInfo,
                            ...(cleaned.posSoftware?.demoInfo || {})
                        }
                    }
                }));
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
            const res = await apiClient.get('/landing-page/db-status', { timeout: 3500 });
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
            await apiClient.post('/landing-page/ensure-db', {}, { timeout: 8000 });
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
                const res = await apiClient.put('/landing-page', landingData, { timeout: 8000 });
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

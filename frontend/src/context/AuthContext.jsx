import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const AUTH_API = `${import.meta.env.VITE_API_BASE_URL}/auth`;
const STORAGE_KEY = 'namastute_auth';

/**
 * Decode the primary role from the roles array returned by the backend.
 * Backend roles: ["SUPER_ADMIN"] | ["ADMIN"] | ["CLIENT"] | ["OTHER"] | ...
 * Frontend ProtectedRoute expects: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT'
 */
function pickRole(roles = []) {
    const priority = ['SUPER_ADMIN', 'ADMIN', 'CLIENT', 'OTHER'];
    for (const r of priority) {
        if (roles.includes(r)) return r;
    }
    return roles[0] ?? 'OTHER';
}

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Restore session from localStorage on mount ──────────────────────────
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setUser(parsed.user);
                setToken(parsed.token);

                // Re-attach token to axios default headers
                if (parsed.token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
                }
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * _persist(token, email, roles)
     * Save to state + localStorage + axios headers.
     */
    const _persist = (jwtToken, email, roles, fullName) => {
        const role = pickRole(roles);
        const userData = { email, name: fullName ?? email, role, roles };

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: jwtToken, user: userData }));
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        setToken(jwtToken);
        setUser(userData);

        return { user: userData, role };
    };

    /**
     * login({ email, password })
     * Returns { success, role } on success, { success: false, error } on failure.
     */
    const login = async ({ email, password }) => {
        try {
            const res = await axios.post(`${AUTH_API}/login`, { email, password });
            const { token: jwt, email: userEmail, roles, fullName } = res.data;
            const { role } = _persist(jwt, userEmail, roles, fullName);
            return { success: true, role };
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                'Invalid email or password.';
            return { success: false, error: typeof msg === 'string' ? msg : 'Login failed. Please try again.' };
        }
    };

    /**
     * register({ fullName, email, password })
     * Auto-logs in after registration. Returns { success, role } or { success: false, error }.
     */
    const register = async ({ fullName, email, password }) => {
        try {
            const res = await axios.post(`${AUTH_API}/register`, { fullName, email, password });
            const { token: jwt, email: userEmail, roles } = res.data;
            const { role } = _persist(jwt, userEmail, roles, fullName);
            return { success: true, role };
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                'Registration failed. Please try again.';
            return { success: false, error: typeof msg === 'string' ? msg : 'Registration failed.' };
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    // ── Role helpers ─────────────────────────────────────────────────────────
    const isSuperAdmin   = () => user?.role === 'SUPER_ADMIN';
    const isAdmin        = () => user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    const isClient       = () => user?.role === 'CLIENT';
    const isAuthenticated = () => user !== null;

    const hasRole = (allowedRoles = []) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isSuperAdmin,
                isAdmin,
                isClient,
                isAuthenticated,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

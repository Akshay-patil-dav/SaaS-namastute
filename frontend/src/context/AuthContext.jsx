import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ─── Demo Credentials ────────────────────────────────────────────────────────
const DEMO_USERS = [
    {
        email: 'superadmin@namastute.com',
        password: 'superadmin123',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
    },
    {
        email: 'admin@namastute.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'ADMIN',
    },
    {
        email: 'client@namastute.com',
        password: 'client123',
        name: 'Client User',
        role: 'CLIENT',
    },
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('namastute_user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            localStorage.removeItem('namastute_user');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * login({ email, password })
     * Returns { success, error }
     */
    const login = ({ email, password }) => {
        const found = DEMO_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
            return { success: false, error: 'Invalid email or password.' };
        }
        const userData = { email: found.email, name: found.name, role: found.role };
        localStorage.setItem('namastute_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, role: found.role };
    };

    const logout = () => {
        localStorage.removeItem('namastute_user');
        setUser(null);
    };

    // ─── Role helpers ─────────────────────────────────────────────────────────
    const isSuperAdmin = () => user?.role === 'SUPER_ADMIN';
    const isAdmin      = () => user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    const isClient     = () => user?.role === 'CLIENT';
    const isAuthenticated = () => user !== null;

    const hasRole = (allowedRoles = []) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
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

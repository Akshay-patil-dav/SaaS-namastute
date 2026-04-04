import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Check if user has admin role
    const isAdmin = () => {
        if (!user || !user.roles) return false;
        return user.roles.includes('ADMIN') || user.roles.includes('SUPER_ADMIN') || user.roles.includes('ROLE_ADMIN');
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    setUser({ 
                        identifier: payload.sub, 
                        roles: payload.roles || ['CLIENT'], 
                        isAuthenticated: true 
                    });
                } else {
                    setUser({ isAuthenticated: true });
                }
            } catch (e) {
                setUser({ isAuthenticated: true });
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = (jwtData) => {
        setToken(jwtData.token);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

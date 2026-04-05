import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Hardcoded "Super Admin" user so all features are accessible
    const [user] = useState({ 
        identifier: 'super_admin_user', 
        roles: ['SUPER_ADMIN'], 
        isAuthenticated: true 
    });
    
    const [token] = useState('guest_token');
    const [loading] = useState(false);

    // Stub out methods so components using them don't crash
    const isAdmin = () => true;
    const login = () => {};
    const logout = () => {};

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuth2RedirectHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const error = getUrlParameter('error');

        if (token) {
            try {
                // Decode JWT to extract email and roles to map to AuthResponse shape
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);
                
                const authData = {
                    token: token,
                    email: decoded.sub,
                    roles: decoded.roles || []
                };
                
                login(authData);
                navigate('/dashboard', { replace: true });
            } catch(e) {
                console.error("Failed to parse token", e);
                navigate('/?error=invalid_token', { replace: true });
            }
        } else {
            console.error("OAuth error:", error);
            navigate(`/?error=${error || 'oauth2_failed'}`, { replace: true });
        }
    }, [location, navigate, login]);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
        </div>
    );
}

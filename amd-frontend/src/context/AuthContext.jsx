import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Restore session on mount
    useEffect(() => {
        const initAuth = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const { user } = await authService.getCurrentUser(accessToken);
                    setUser(user);
                } catch (err) {
                    console.error('Failed to restore session:', err);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const signup = useCallback(async (email, password, metadata) => {
        setError(null);
        try {
            const data = await authService.signup(email, password, metadata);
            if (data.session) {
                localStorage.setItem('access_token', data.session.access_token);
                localStorage.setItem('refresh_token', data.session.refresh_token);
            }
            if (data.user) setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setError(null);
        try {
            const data = await authService.login(email, password);
            if (data.session) {
                localStorage.setItem('access_token', data.session.access_token);
                localStorage.setItem('refresh_token', data.session.refresh_token);
            }
            if (data.user) setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        setError(null);
        try {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) await authService.logout(accessToken);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    }, []);

    const refreshToken = useCallback(async () => {
        const token = localStorage.getItem('refresh_token');
        if (!token) throw new Error('No refresh token');
        try {
            const { session } = await authService.refreshToken(token);
            localStorage.setItem('access_token', session.access_token);
            localStorage.setItem('refresh_token', session.refresh_token);
            return session;
        } catch (err) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            throw err;
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            isAuthenticated: !!user,
            signup,
            login,
            logout,
            refreshToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

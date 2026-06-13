import { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../lib/utils';
import { authAPI } from '../lib/api';
import { USER_ROLES } from '../lib/constants';

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedUser = storage.get('user');
        const token = storage.get('authToken');

        if (storedUser && token) {
            setUser(storedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user: userData } = response;

            storage.set('authToken', token);
            if (userData) {                    // ← add this guard
                storage.set('user', userData);
            }
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            await authAPI.verifyOTP({ email, code: otp });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message || 'OTP verification failed' };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            storage.remove('authToken');
            storage.remove('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (userData) => {
        storage.set('user', userData);
        setUser(userData);
    };

    // Role-based access
    const hasRole = (role) => {
        if (!user) return false;
        return user.accountType === role;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        verifyOTP,
        logout,
        updateUser,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

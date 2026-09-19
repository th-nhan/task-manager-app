import { createContext, useState, useEffect, useContext } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const res = await authApi.getProfile();
            if (res?.user) {
                setUser(res.user);
                localStorage.setItem('user', JSON.stringify(res.user));
                return res.user;
            }
        } catch (error) {
            console.error('Failed to sync profile from server:', error);
            if (error?.response?.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        return null;
    };

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (savedUser && token) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem('user');
                }
            }

            setLoading(false);

            // Sync latest user info (avatar, name, email) from server in the background (non-blocking)
            if (token) {
                refreshUser();
            }
        };

        initAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
        // Refresh immediately to ensure complete profile data
        refreshUser();
    };

    const updateUser = (updatedData) => {
        setUser((prev) => {
            const nextUser = { ...prev, ...updatedData };
            localStorage.setItem('user', JSON.stringify(nextUser));
            return nextUser;
        });
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, refreshUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

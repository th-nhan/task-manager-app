import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationContainer from '../components/Notification';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const showNotification = useCallback((message, options = {}) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9);
        const {
            type = 'info', // 'success' | 'error' | 'warning' | 'info'
            title = '',
            duration = 4000,
        } = typeof options === 'string' ? { type: options } : options;

        const newNotification = {
            id,
            message,
            type,
            title,
            duration,
        };

        setNotifications((prev) => [...prev, newNotification]);
        return id;
    }, []);

    const toast = {
        success: (message, options = {}) => showNotification(message, { ...options, type: 'success' }),
        error: (message, options = {}) => showNotification(message, { ...options, type: 'error' }),
        warning: (message, options = {}) => showNotification(message, { ...options, type: 'warning' }),
        info: (message, options = {}) => showNotification(message, { ...options, type: 'info' }),
        show: showNotification,
        dismiss: removeNotification,
    };

    return (
        <NotificationContext.Provider value={{ showNotification, removeNotification, toast }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const useToast = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useToast must be used within a NotificationProvider');
    }
    return context.toast;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'task_manager_theme';

export const THEMES = {
    pink: {
        id: 'pink',
        name: 'Pink Blossom',
        shortName: 'Pink',
        description: '',
        bgPreview: '#FFF5F7',
        cardPreview: '#FFFFFF',
        accentColor: '#EC4899',
        borderPreview: '#FED7E2',
        isDark: false,
    },
    green: {
        id: 'green',
        name: 'Coder Green',
        shortName: 'Green',
        description: '',
        bgPreview: '#0D1117',
        cardPreview: '#161B22',
        accentColor: '#2EA043',
        borderPreview: '#30363D',
        isDark: true,
    },
    dark: {
        id: 'dark',
        name: 'Classic Dark',
        shortName: 'Dark',
        description: '',
        bgPreview: '#111A24',
        cardPreview: '#1B2634',
        accentColor: '#38BDF8',
        borderPreview: '#33465C',
        isDark: true,
    },
    purple: {
        id: 'purple',
        name: 'Royal Purple',
        shortName: 'Purple',
        description: '',
        bgPreview: '#FAF5FF',
        cardPreview: '#FFFFFF',
        accentColor: '#7C3AED',
        borderPreview: '#E9D5FF',
        isDark: false,
    },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        try {
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved && THEMES[saved]) return saved;
        } catch (e) {
            console.error('Failed to read theme from localStorage', e);
        }
        return 'pink';
    });

    const setTheme = (newTheme) => {
        if (!THEMES[newTheme]) return;
        setThemeState(newTheme);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (e) {
            console.error('Failed to save theme to localStorage', e);
        }
    };

    useEffect(() => {
        const root = document.documentElement;
        // Remove all theme classes
        Object.keys(THEMES).forEach((t) => {
            root.classList.remove(t);
        });
        // Add current theme class
        root.classList.add(theme);
        root.setAttribute('data-theme', theme);
    }, [theme]);

    const currentThemeConfig = THEMES[theme] || THEMES.pink;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, currentThemeConfig, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;


import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, Moon, Sun, Terminal } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeSwitcher = ({ variant = 'dropdown' }) => {
    const { theme, setTheme, themes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const themeIcons = {
        pink: '',
        green: '',
        dark: '',
        purple: '',
    };

    if (variant === 'inline') {
        // Mobile drawer layout
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Theme / Giao diện</span>
                    <span className="text-xs">{themeIcons[theme]} {themes[theme]?.shortName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(themes).map((t) => {
                        const isSelected = theme === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTheme(t.id)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-[var(--accent)] bg-[var(--accent-subtle)] shadow-xs font-bold'
                                        : 'border-gray-200/80 bg-white/50 hover:bg-white hover:border-gray-300'
                                }`}
                            >
                                <span
                                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs shadow-xs"
                                    style={{ backgroundColor: t.accentColor, color: '#fff' }}
                                >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold truncate text-[var(--text-main)]">
                                        {t.name}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Default: Header dropdown
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                title="Thay đổi chủ đề / Change Theme"
                aria-label="Change Theme"
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl border border-transparent hover:border-[var(--border-color)] hover:bg-[var(--bg-subtle)] transition-all cursor-pointer text-[var(--text-main)]"
            >
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs transition-transform hover:scale-105"
                    style={{ backgroundColor: themes[theme]?.accentColor, color: '#fff' }}
                >
                    <Palette className="w-3.5 h-3.5" />
                </div>
                <span className="hidden xl:inline text-xs font-bold truncate max-w-[90px]">
                    {themes[theme]?.shortName}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-color)]">
                        <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-[var(--accent)]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                Chọn Giao Diện
                            </span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--accent)]">
                            {themes[theme]?.name}
                        </span>
                    </div>

                    <div className="space-y-1.5">
                        {Object.values(themes).map((t) => {
                            const isSelected = theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => {
                                        setTheme(t.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                                        isSelected
                                            ? 'border-[var(--accent)] bg-[var(--accent-subtle)] font-bold'
                                            : 'border-transparent hover:bg-[var(--bg-subtle)] hover:border-[var(--border-color)]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Color Palette Swatch Preview */}
                                        <div
                                            className="w-7 h-7 rounded-lg border border-black/10 shrink-0 flex items-center justify-center shadow-xs overflow-hidden relative"
                                            style={{ backgroundColor: t.bgPreview }}
                                        >
                                            <div
                                                className="w-3.5 h-3.5 rounded-full"
                                                style={{ backgroundColor: t.accentColor }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors truncate">
                                                {themeIcons[t.id]} {t.name}
                                            </p>
                                            <p className="text-[11px] text-[var(--text-muted)] truncate">
                                                {t.description}
                                            </p>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <Check className="w-4 h-4 text-[var(--accent)] stroke-[2.5] shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;


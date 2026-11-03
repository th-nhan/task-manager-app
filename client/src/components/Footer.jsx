import React from 'react';
import { Heart } from 'lucide-react';

const Footer = ({ className = "" }) => {
    const currentYear = 2026;

    return (
        <footer className={`w-full py-5 text-center select-none ${className}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-[11px] sm:text-xs font-medium tracking-wide text-[var(--text-muted)]">
                <span>
                    © {currentYear} <span className="font-semibold text-[var(--text-main)]">TaskNote</span>. All rights reserved.
                </span>
                <span className="hidden sm:inline opacity-60">•</span>
                <span className="inline-flex items-center gap-1">
                    <span>Designed & Developed with</span>
                    <Heart className="w-3 h-3 text-[var(--accent)] fill-[var(--accent)] inline-block animate-pulse" />
                    <span>by</span>
                    <span className="font-bold text-[var(--text-main)] hover:text-[var(--accent)] transition-colors cursor-default">
                        ThanhNhan
                    </span>
                </span>
            </div>
        </footer>
    );
};

export default Footer;

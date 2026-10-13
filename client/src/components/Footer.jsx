import React from 'react';
import { Heart } from 'lucide-react';

const Footer = ({ className = "" }) => {
    const currentYear = 2026;

    return (
        <footer className={`w-full py-5 text-center select-none ${className}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 text-[11px] sm:text-xs font-medium tracking-wide text-pink-900/45">
                <span>
                    © {currentYear} <span className="font-semibold text-pink-900/65">TaskNote</span>. All rights reserved.
                </span>
                <span className="hidden sm:inline text-pink-300/80">•</span>
                <span className="inline-flex items-center gap-1">
                    <span>Designed & Developed with</span>
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400 inline-block animate-pulse" />
                    <span>by</span>
                    <span className="font-bold text-pink-900/70 hover:text-pink-600 transition-colors cursor-default">
                        ThanhNhan
                    </span>
                </span>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const typeConfig = {
    success: {
        icon: CheckCircle2,
        iconBg: 'bg-pink-100 text-pink-500',
        borderColor: 'border-pink-200',
        progressBarBg: 'bg-gradient-to-r from-pink-400 to-pink-500',
        defaultTitle: 'Success',
    },
    error: {
        icon: AlertCircle,
        iconBg: 'bg-red-100 text-red-500',
        borderColor: 'border-red-200',
        progressBarBg: 'bg-gradient-to-r from-red-400 to-pink-500',
        defaultTitle: 'Error',
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-100 text-amber-500',
        borderColor: 'border-amber-200',
        progressBarBg: 'bg-gradient-to-r from-amber-400 to-pink-400',
        defaultTitle: 'Warning',
    },
    info: {
        icon: Info,
        iconBg: 'bg-pink-50 text-pink-500',
        borderColor: 'border-pink-200',
        progressBarBg: 'bg-gradient-to-r from-pink-300 to-pink-500',
        defaultTitle: 'Notification',
    },
};

export const NotificationItem = ({ notification, onRemove }) => {
    const { id, message, type = 'info', title, duration = 4000 } = notification;
    const [isExiting, setIsExiting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const remainingTimeRef = useRef(duration);

    const config = typeConfig[type] || typeConfig.info;
    const IconComponent = config.icon;
    const displayTitle = title || config.defaultTitle;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(id);
        }, 200);
    };

    useEffect(() => {
        if (duration <= 0) return;

        if (!isPaused) {
            startTimeRef.current = Date.now();
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, remainingTimeRef.current);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isPaused, duration]);

    const handleMouseEnter = () => {
        if (duration <= 0) return;
        setIsPaused(true);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleMouseLeave = () => {
        if (duration <= 0) return;
        setIsPaused(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-pink-200/40 border ${config.borderColor} relative overflow-hidden transition-all duration-200 flex items-start gap-3.5 select-none ${
                isExiting
                    ? 'opacity-0 translate-x-8 scale-95 duration-200'
                    : 'animate-in fade-in slide-in-from-top-4 duration-300'
            }`}
            role="alert"
        >
            {/* Icon với viền tròn tông hồng */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg} shadow-sm`}>
                <IconComponent className="w-5 h-5" />
            </div>

            {/* Nội dung thông báo */}
            <div className="flex-1 min-w-0 pt-0.5">
                {displayTitle && (
                    <h5 className="text-sm font-semibold text-gray-800 leading-tight mb-0.5">
                        {displayTitle}
                    </h5>
                )}
                <p className="text-xs text-gray-600 leading-relaxed break-words font-medium">
                    {message}
                </p>
            </div>

            {/* Nút đóng */}
            <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg p-1 transition-colors cursor-pointer shrink-0"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Thanh tiến trình màu hồng GPU-accelerated */}
            {duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-100/60 overflow-hidden">
                    <div
                        className={`h-full w-full ${config.progressBarBg} origin-left will-change-transform`}
                        style={{
                            animation: `progressShrink ${duration}ms linear forwards`,
                            animationPlayState: isPaused ? 'paused' : 'running',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
    const config = typeConfig[type] || typeConfig.info;
    const IconComponent = config.icon;

    return (
        <div
            className={`w-full p-3.5 bg-pink-50/70 border ${config.borderColor} rounded-xl flex items-start gap-3 text-pink-500 ${className}`}
        >
            <div className={`p-1 rounded-lg ${config.iconBg} shrink-0 mt-0.5`}>
                <IconComponent className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                {title && <div className="text-xs font-bold text-gray-800 mb-0.5">{title}</div>}
                <div className="text-xs text-gray-700 font-medium leading-relaxed">{message}</div>
            </div>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-pink-600 hover:bg-pink-100 rounded-md p-0.5 transition-colors cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};

const NotificationContainer = ({ notifications, onRemove }) => {
    if (!notifications || notifications.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0">
            {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto">
                    <NotificationItem notification={notification} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;

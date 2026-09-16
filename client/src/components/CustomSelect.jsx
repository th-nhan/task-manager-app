import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
    label, 
    value, 
    onChange, 
    options = [], 
    className = '',
    placeholder = 'Select option' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value) || (value ? { label: value, value } : null);

    return (
        <div className={`w-full relative ${className}`} ref={dropdownRef}>
            {label && <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-pink-500 flex items-center justify-between border bg-white rounded-xl px-3.5 py-2 sm:py-2.5 text-left outline-none transition-all duration-150 cursor-pointer min-h-[38px] ${
                    isOpen ? 'ring-2 ring-pink-300 border-pink-300 shadow-xs' : 'border-gray-200 hover:border-pink-300'
                }`}
            >
                <span className="text-pink-500 text-xs sm:text-sm font-semibold truncate mr-1">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-pink-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-full min-w-[160px] bg-white border border-pink-100 rounded-2xl shadow-xl shadow-pink-100/50 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`px-3 py-2 text-xs sm:text-sm rounded-xl cursor-pointer transition-colors duration-150 min-h-[36px] flex items-center ${
                                    isSelected
                                        ? 'bg-pink-500 text-white font-bold shadow-xs'
                                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                                }`}
                            >
                                {opt.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
export { CustomSelect };

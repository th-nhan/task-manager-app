import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseUploadedTimetableExcel } from '../../data/timetableData';

export const ExcelUploaderModal = ({
    isOpen,
    onClose,
    onImportSuccess,
    onResetDefault
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFile = async (file) => {
        if (!file) return;
        setError('');
        setFileName(file.name);

        try {
            const buffer = await file.arrayBuffer();
            const parsed = parseUploadedTimetableExcel(buffer);
            if (parsed && parsed.length > 0) {
                onImportSuccess(parsed);
                onClose();
            } else {
                setError('Could not find a valid timetable matrix structure in the Excel file.');
            }
        } catch (err) {
            console.error('Import error:', err);
            setError('An error occurred while reading the Excel file. Please try again.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            <div
                className="bg-[var(--bg-card)] rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-md max-h-[90dvh] overflow-hidden border border-[var(--border-color)] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] shrink-0">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[var(--text-main)] text-sm sm:text-base">Update Timetable Excel</h3>
                            <p className="text-xs text-[var(--text-muted)]">Upload spreadsheet matrix</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Upload Zone */}
                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-[var(--bg-subtle)]">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                            dragActive
                                ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                                : 'border-[var(--border-color)] hover:border-[var(--accent)] bg-[var(--bg-card)]'
                        }`}
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)]">
                            <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[var(--text-main)]">Drag & drop Excel file here</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">or tap to select from device</p>
                        </div>

                        <label className="mt-2 inline-flex items-center px-4 py-2.5 text-xs font-semibold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-xl shadow-xs cursor-pointer transition-colors min-h-[38px]">
                            Choose File (.xlsx / .xls)
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                className="hidden"
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFile(e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {fileName && !error && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="font-medium truncate">Processing: {fileName}</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 p-3 rounded-2xl border border-rose-500/30">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Reset Option */}
                    <div className="pt-2 flex items-center justify-between border-t border-[var(--border-color)]">
                        <button
                            onClick={() => {
                                onResetDefault();
                                onClose();
                            }}
                            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] font-semibold transition-colors cursor-pointer py-2"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restore Default Timetable
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploaderModal;

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
                setError('Không thể tìm thấy cấu trúc bảng thời khóa biểu hợp lệ trong file Excel.');
            }
        } catch (err) {
            console.error('Import error:', err);
            setError('Đã xảy ra lỗi khi đọc file Excel. Vui lòng thử lại.');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-pink-100 animate-scale-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-base">Cập Nhật File Excel TKB</h3>
                            <p className="text-xs text-gray-500">Tải lên file thời khóa biểu mới</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-white/80 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Upload Zone */}
                <div className="p-6 space-y-4">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                            dragActive
                                ? 'border-pink-500 bg-pink-50/50'
                                : 'border-pink-200 hover:border-pink-400 bg-pink-50/20'
                        }`}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500">
                            <UploadCloud className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">Kéo thả file Excel vào đây</p>
                            <p className="text-xs text-gray-400 mt-0.5">hoặc nhấp chuột để chọn file từ máy</p>
                        </div>

                        <label className="mt-2 inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-xl shadow-xs cursor-pointer transition-colors">
                            Chọn File (.xlsx / .xls)
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
                        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="font-medium truncate">Đang xử lý: {fileName}</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-200">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Reset Option */}
                    <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                        <button
                            onClick={() => {
                                onResetDefault();
                                onClose();
                            }}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-pink-600 font-semibold transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Khôi phục TKB gốc mặc định
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploaderModal;

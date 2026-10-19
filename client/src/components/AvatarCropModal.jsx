import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    RotateCw,
    RotateCcw,
    ZoomIn,
    ZoomOut,
    FlipHorizontal,
    FlipVertical,
    RefreshCw,
    Check,
    X,
    Move,
    Sparkles,
    Circle,
    Square,
} from 'lucide-react';

const CANVAS_DISPLAY_SIZE = 320; // Width & height of the editing area
const CROP_DIAMETER = 260; // Diameter of the crop circle/square
const OUTPUT_SIZE = 400; // Output avatar pixel dimensions

export const AvatarCropModal = ({
    isOpen,
    imageSrc,
    onClose,
    onCropComplete,
    isSaving = false,
}) => {
    const canvasRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imageElement, setImageElement] = useState(null);

    // Transform states
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0); // in degrees: -180 to 180
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [cropShape, setCropShape] = useState('circle'); // 'circle' | 'square'

    // Interaction states
    const [isDragging, setIsDragging] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const dragStartRef = useRef({ x: 0, y: 0 });
    const positionStartRef = useRef({ x: 0, y: 0 });

    // Load image when imageSrc changes
    useEffect(() => {
        if (!imageSrc) {
            setImageElement(null);
            setLoadError('');
            return;
        }

        setIsImageLoading(true);
        setLoadError('');

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setImageElement(img);
            setIsImageLoading(false);
            setLoadError('');
            // Reset transforms
            setZoom(1);
            setRotation(0);
            setFlipH(false);
            setFlipV(false);
            setPosition({ x: 0, y: 0 });
        };
        img.onerror = () => {
            setIsImageLoading(false);
            setLoadError('Failed to load image. The image URL might be inaccessible or protected by CORS.');
        };
        img.src = imageSrc;
    }, [imageSrc]);

    // Calculate base scale to make the image cover the crop diameter at zoom = 1
    const getBaseScale = useCallback(() => {
        if (!imageElement) return 1;
        const minDimension = Math.min(imageElement.naturalWidth, imageElement.naturalHeight);
        return minDimension > 0 ? CROP_DIAMETER / minDimension : 1;
    }, [imageElement]);

    // Redraw the main interactive canvas
    const drawMainCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageElement) return;

        const ctx = canvas.getContext('2d');
        const size = CANVAS_DISPLAY_SIZE;
        canvas.width = size;
        canvas.height = size;

        const center = size / 2;
        const baseScale = getBaseScale();
        const currentScale = baseScale * zoom;
        const rad = (rotation * Math.PI) / 180;

        ctx.clearRect(0, 0, size, size);

        // 1. Draw transformed image
        ctx.save();
        ctx.translate(center + position.x, center + position.y);
        ctx.rotate(rad);
        ctx.scale(currentScale * (flipH ? -1 : 1), currentScale * (flipV ? -1 : 1));
        ctx.drawImage(
            imageElement,
            -imageElement.naturalWidth / 2,
            -imageElement.naturalHeight / 2,
            imageElement.naturalWidth,
            imageElement.naturalHeight
        );
        ctx.restore();

        // 2. Draw Semi-transparent Overlay Mask
        ctx.save();
        // Create an offscreen path for darkening outside crop area
        ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'; // Dark slate overlay
        ctx.fillRect(0, 0, size, size);

        // Punch a hole in the overlay for the crop region
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        const radius = CROP_DIAMETER / 2;
        if (cropShape === 'circle') {
            ctx.arc(center, center, radius, 0, Math.PI * 2);
        } else {
            const cornerR = 24;
            ctx.roundRect(center - radius, center - radius, CROP_DIAMETER, CROP_DIAMETER, cornerR);
        }
        ctx.fill();

        // 3. Draw border around the crop region
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Subtle grid lines (rule of thirds) when dragging or rotating
        if (isDragging) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);

            const step = CROP_DIAMETER / 3;
            const start = center - radius;

            ctx.save();
            ctx.beginPath();
            if (cropShape === 'circle') {
                ctx.arc(center, center, radius, 0, Math.PI * 2);
            } else {
                ctx.rect(center - radius, center - radius, CROP_DIAMETER, CROP_DIAMETER);
            }
            ctx.clip();

            // Vertical grid lines
            ctx.beginPath();
            ctx.moveTo(start + step, start);
            ctx.lineTo(start + step, start + CROP_DIAMETER);
            ctx.moveTo(start + step * 2, start);
            ctx.lineTo(start + step * 2, start + CROP_DIAMETER);
            // Horizontal grid lines
            ctx.moveTo(start, start + step);
            ctx.lineTo(start + CROP_DIAMETER, start + step);
            ctx.moveTo(start, start + step * 2);
            ctx.lineTo(start + CROP_DIAMETER, start + step * 2);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }, [imageElement, getBaseScale, zoom, rotation, flipH, flipV, position, cropShape, isDragging]);

    // Redraw live mini preview
    const drawPreviewCanvas = useCallback(() => {
        const previewCanvas = previewCanvasRef.current;
        if (!previewCanvas || !imageElement) return;

        const ctx = previewCanvas.getContext('2d');
        const previewSize = previewCanvas.width; // e.g. 80
        ctx.clearRect(0, 0, previewSize, previewSize);

        const ratio = previewSize / CROP_DIAMETER;
        const center = previewSize / 2;
        const baseScale = getBaseScale();
        const currentScale = baseScale * zoom * ratio;
        const rad = (rotation * Math.PI) / 180;

        ctx.save();
        // Clip to avatar shape
        ctx.beginPath();
        if (cropShape === 'circle') {
            ctx.arc(center, center, previewSize / 2, 0, Math.PI * 2);
        } else {
            ctx.roundRect(0, 0, previewSize, previewSize, 16);
        }
        ctx.clip();

        // Draw image transformed
        ctx.translate(center + position.x * ratio, center + position.y * ratio);
        ctx.rotate(rad);
        ctx.scale(currentScale * (flipH ? -1 : 1), currentScale * (flipV ? -1 : 1));
        ctx.drawImage(
            imageElement,
            -imageElement.naturalWidth / 2,
            -imageElement.naturalHeight / 2,
            imageElement.naturalWidth,
            imageElement.naturalHeight
        );
        ctx.restore();
    }, [imageElement, getBaseScale, zoom, rotation, flipH, flipV, position, cropShape]);

    useEffect(() => {
        drawMainCanvas();
        drawPreviewCanvas();
    }, [drawMainCanvas, drawPreviewCanvas]);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        positionStartRef.current = { ...position };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        setPosition({
            x: positionStartRef.current.x + deltaX,
            y: positionStartRef.current.y + deltaY,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch drag handlers for mobile
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            positionStartRef.current = { ...position };
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - dragStartRef.current.x;
        const deltaY = e.touches[0].clientY - dragStartRef.current.y;
        setPosition({
            x: positionStartRef.current.x + deltaX,
            y: positionStartRef.current.y + deltaY,
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Wheel zoom handler
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        setZoom(prev => Math.min(3.5, Math.max(0.6, Number((prev + delta).toFixed(2)))));
    };

    // Rotation quick buttons
    const handleRotateStep = (degrees) => {
        setRotation(prev => {
            let next = prev + degrees;
            while (next > 180) next -= 360;
            while (next < -180) next += 360;
            return next;
        });
    };

    // Reset all transformations
    const handleReset = () => {
        setZoom(1);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setPosition({ x: 0, y: 0 });
    };

    // Export cropped avatar
    const handleSaveCrop = () => {
        if (!imageElement || isSaving) return;

        try {
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = OUTPUT_SIZE;
            outputCanvas.height = OUTPUT_SIZE;
            const ctx = outputCanvas.getContext('2d');

            const ratio = OUTPUT_SIZE / CROP_DIAMETER;
            const center = OUTPUT_SIZE / 2;
            const baseScale = getBaseScale();
            const currentScale = baseScale * zoom * ratio;
            const rad = (rotation * Math.PI) / 180;

            ctx.save();
            // Transparent background
            ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

            ctx.translate(center + position.x * ratio, center + position.y * ratio);
            ctx.rotate(rad);
            ctx.scale(currentScale * (flipH ? -1 : 1), currentScale * (flipV ? -1 : 1));
            ctx.drawImage(
                imageElement,
                -imageElement.naturalWidth / 2,
                -imageElement.naturalHeight / 2,
                imageElement.naturalWidth,
                imageElement.naturalHeight
            );
            ctx.restore();

            // Quality 0.9 JPEG / PNG
            const croppedDataUrl = outputCanvas.toDataURL('image/jpeg', 0.9);
            onCropComplete(croppedDataUrl);
        } catch (err) {
            console.error('Crop export error:', err);
            setLoadError('Cannot crop this image due to browser cross-origin security restrictions. Please download the image and upload it from your device.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => !isSaving && onClose()}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-100 z-10 animate-in zoom-in-95 duration-200 max-h-[96dvh] overflow-y-auto no-scrollbar flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-pink-100/70 text-pink-600 rounded-2xl">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-gray-800">
                                Crop & Adjust Avatar
                            </h3>
                            <p className="text-xs text-gray-400">
                                Rotate, zoom, and reposition for the perfect profile picture
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Interactive Canvas Area */}
                <div className="flex flex-col items-center">
                    <div
                        className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-inner select-none cursor-grab active:cursor-grabbing border border-slate-700/50 touch-none flex items-center justify-center"
                        style={{ width: CANVAS_DISPLAY_SIZE, height: CANVAS_DISPLAY_SIZE }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onWheel={handleWheel}
                    >
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_DISPLAY_SIZE}
                            height={CANVAS_DISPLAY_SIZE}
                            className="block"
                        />

                        {/* Loading spinner */}
                        {isImageLoading && (
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-20">
                                <RefreshCw className="w-8 h-8 animate-spin text-pink-500" />
                                <span className="text-xs font-semibold text-pink-200">Loading image...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {loadError && !isImageLoading && (
                            <div className="absolute inset-0 bg-slate-900/95 p-4 flex flex-col items-center justify-center text-center text-white gap-2 z-20">
                                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-full">
                                    <X className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-rose-300 max-w-[260px] leading-relaxed">{loadError}</p>
                            </div>
                        )}

                        {/* Hint overlay badge */}
                        {!loadError && !isImageLoading && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-semibold text-white/90 pointer-events-none flex items-center gap-1.5 shadow-xs whitespace-nowrap">
                                <Move className="w-3 h-3 text-pink-400" />
                                <span>Drag to reposition • Scroll to zoom</span>
                            </div>
                        )}
                    </div>

                    {/* Shape Switcher & Mini Live Preview */}
                    <div className="flex items-center justify-between w-full max-w-[320px] mt-2.5 px-1">
                        <div className="flex items-center gap-1 bg-pink-50/70 p-0.5 rounded-xl border border-pink-100">
                            <button
                                type="button"
                                onClick={() => setCropShape('circle')}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    cropShape === 'circle'
                                        ? 'bg-pink-500 text-white shadow-xs'
                                        : 'text-gray-600 hover:text-pink-600'
                                }`}
                            >
                                <Circle className="w-3.5 h-3.5" />
                                <span>Circle</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCropShape('square')}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    cropShape === 'square'
                                        ? 'bg-pink-500 text-white shadow-xs'
                                        : 'text-gray-600 hover:text-pink-600'
                                }`}
                            >
                                <Square className="w-3.5 h-3.5" />
                                <span>Rounded</span>
                            </button>
                        </div>

                        {/* Live Avatar Preview */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400">Preview:</span>
                            <div className="relative p-0.5 bg-linear-to-tr from-pink-400 to-rose-400 rounded-full shadow-xs">
                                <canvas
                                    ref={previewCanvasRef}
                                    width={40}
                                    height={40}
                                    className={`block ${cropShape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Adjustment Controls Section */}
                <div className="space-y-3.5 bg-pink-50/40 p-3.5 rounded-2xl border border-pink-100/80">
                    {/* Zoom Slider Control */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <ZoomIn className="w-3.5 h-3.5 text-pink-500" />
                                <span>Zoom</span>
                            </span>
                            <span className="text-pink-600 font-extrabold">{zoom.toFixed(2)}x</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setZoom(prev => Math.max(0.6, Number((prev - 0.1).toFixed(2))))}
                                className="p-1.5 text-gray-600 hover:text-pink-600 bg-white hover:bg-pink-100 rounded-xl border border-pink-100 shadow-2xs transition-all cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                                title="Zoom out"
                            >
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <input
                                type="range"
                                min="0.6"
                                max="3.5"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="flex-1 accent-pink-500 cursor-pointer h-1.5 bg-pink-200 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setZoom(prev => Math.min(3.5, Number((prev + 0.1).toFixed(2))))}
                                className="p-1.5 text-gray-600 hover:text-pink-600 bg-white hover:bg-pink-100 rounded-xl border border-pink-100 shadow-2xs transition-all cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                                title="Zoom in"
                            >
                                <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Rotation Fine-tune Slider & 90-deg Buttons */}
                    <div>
                        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <RotateCw className="w-3.5 h-3.5 text-pink-500" />
                                <span>Rotation</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-black ${rotation !== 0 ? 'text-pink-600' : 'text-gray-500'}`}>
                                    {rotation > 0 ? `+${rotation}` : rotation}°
                                </span>
                                {rotation !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setRotation(0)}
                                        className="text-[10px] text-pink-500 hover:underline font-bold cursor-pointer"
                                    >
                                        0°
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => handleRotateStep(-90)}
                                className="p-1.5 text-gray-600 hover:text-pink-600 bg-white hover:bg-pink-100 rounded-xl border border-pink-100 shadow-2xs transition-all cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                                title="Rotate left 90°"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                step="1"
                                value={rotation}
                                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                                className="flex-1 accent-pink-500 cursor-pointer h-1.5 bg-pink-200 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRotateStep(90)}
                                className="p-1.5 text-gray-600 hover:text-pink-600 bg-white hover:bg-pink-100 rounded-xl border border-pink-100 shadow-2xs transition-all cursor-pointer min-w-[30px] min-h-[30px] flex items-center justify-center"
                                title="Rotate right 90°"
                            >
                                <RotateCw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Action Tools: Flip & Reset */}
                    <div className="flex items-center justify-between pt-1 border-t border-pink-100/60">
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setFlipH(prev => !prev)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                    flipH
                                        ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                                        : 'bg-white text-gray-600 hover:bg-pink-50 border-pink-100'
                                }`}
                                title="Flip horizontally"
                            >
                                <FlipHorizontal className="w-3.5 h-3.5" />
                                <span>Flip H</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFlipV(prev => !prev)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                    flipV
                                        ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                                        : 'bg-white text-gray-600 hover:bg-pink-50 border-pink-100'
                                }`}
                                title="Flip vertically"
                            >
                                <FlipVertical className="w-3.5 h-3.5" />
                                <span>Flip V</span>
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all border border-pink-100 flex items-center gap-1 cursor-pointer"
                            title="Reset all adjustments"
                        >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-pink-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50 min-h-[38px]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveCrop}
                        disabled={isSaving || !imageElement}
                        className="px-5 py-2 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-pink-200 hover:shadow-pink-300 disabled:opacity-50 min-h-[38px] flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Apply & Save Avatar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarCropModal;

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Expand, Shrink } from 'lucide-react';

const WorkItemModal = ({ isOpen, onClose, children }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 700, height: 600 });
    const modalRef = useRef(null);
    const isDragging = useRef(false);
    const isResizing = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) {
            // Center the modal on open
            const x = (window.innerWidth - size.width) / 2;
            const y = (window.innerHeight - size.height) / 2;
            setPosition({ x, y });
        }
    }, [isOpen]);

    const handleMouseDown = (e) => {
        if (isMaximized || isMinimized) return;
        if (e.target.closest('.modal-header')) {
            isDragging.current = true;
            dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    const handleResizeMouseDown = (e) => {
        if (isMaximized || isMinimized) return;
        e.preventDefault();
        isResizing.current = true;
        resizeStart.current = {
            width: size.width,
            height: size.height,
            x: e.clientX,
            y: e.clientY
        };
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) {
            setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y
            });
        }
    };

    const handleResizeMouseMove = (e) => {
        if (isResizing.current) {
            const deltaX = e.clientX - resizeStart.current.x;
            const deltaY = e.clientY - resizeStart.current.y;
            setSize({
                width: Math.max(400, resizeStart.current.width + deltaX),
                height: Math.max(300, resizeStart.current.height + deltaY)
            });
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleResizeMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
    };

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
        if (isMinimized) setIsMinimized(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        if (isMaximized) setIsMaximized(false);
    };

    if (!isOpen) return null;

    const modalStyle = isMaximized
        ? { top: 0, left: 0, width: '100vw', height: '100vh', borderRadius: 0, position: 'fixed' }
        : isMinimized
            ? { bottom: 20, right: 20, width: 250, height: 48, position: 'fixed', top: 'auto', left: 'auto' }
            : {
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                position: 'fixed'
            };

    return (
        <>
            {/* Backdrop overlay - click to close */}
            <div
                className={`fixed inset-0 z-[9998] ${isMaximized ? 'bg-black/20' : 'bg-transparent'}`}
                onClick={onClose}
            />
            <div
                ref={modalRef}
                className={`bg-panel shadow-premium border border-border flex flex-col z-[9999] overflow-hidden transition-all duration-200 ease-in-out ${!isMaximized && !isMinimized ? 'rounded-xl' : ''}`}
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className={`modal-header flex items-center justify-between px-4 py-3 bg-panel border-b border-border select-none ${isDragging.current ? 'cursor-grabbing' : 'cursor-grab'} ${isMinimized ? 'h-full' : ''}`}
                    onMouseDown={handleMouseDown}
                >
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-primary text-sm">Create Issue</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleMinimize}
                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
                            title="Minimize"
                        >
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={toggleMaximize}
                            className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"
                            title={isMaximized ? "Restore" : "Maximize"}
                        >
                            {isMaximized ? <Shrink className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-md text-gray-400 transition-colors"
                            title="Close"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {!isMinimized && (
                    <div className="flex-1 overflow-y-auto bg-panel p-6">
                        {children}
                    </div>
                )}

                {/* Resize Handle */}
                {!isMaximized && !isMinimized && (
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                        onMouseDown={handleResizeMouseDown}
                    >
                        <svg viewBox="0 0 24 24" className="w-full h-full text-gray-300 fill-current opacity-50">
                            <path d="M22 22h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 4h-2v-2h2v2z" />
                        </svg>
                    </div>
                )}
            </div>
        </>
    );
};

export default WorkItemModal;


import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const execCommand = (command, val = null) => {
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = (e) => {
        onChange(e.target.innerHTML);
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (re) => {
                    execCommand('insertImage', re.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleLink = () => {
        const url = prompt('Enter the link URL:');
        if (url) execCommand('createLink', url);
    };

    return (
        <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-primary-deep transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50/50 border-b border-gray-100 flex-wrap">
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); execCommand('bold'); }}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-primary-deep transition-all active:scale-95"
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); execCommand('italic'); }}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-primary-deep transition-all active:scale-95"
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); execCommand('underline'); }}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-primary-deep transition-all active:scale-95"
                    title="Underline"
                >
                    <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-primary-deep transition-all active:scale-95"
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleLink(); }}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-primary-deep transition-all active:scale-95"
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleImageUpload(); }}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 hover:text-primary-deep transition-all active:scale-95"
                    title="Image Upload"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                className="p-4 min-h-[150px] focus:outline-none text-slate-700 text-sm leading-relaxed"
                onInput={handleInput}
                suppressContentEditableWarning
            ></div>
        </div>
    );
};

export default RichTextEditor;

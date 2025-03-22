"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md p-1 bg-white">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 px-2 hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100 text-primary' : ''}`}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 px-2 hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100 text-primary' : ''}`}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-gray-200" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 px-2 hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100 text-primary' : ''}`}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

interface JobDescriptionEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function JobDescriptionEditor({ value, onChange }: JobDescriptionEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4'
                    }
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // autofocus: true,
    });

    const handleContainerClick = () => {
        editor?.chain().focus().run();
    };

    return (
        <div className="w-full">
            <div
                ref={editorRef}
                className="border rounded-lg overflow-hidden bg-white cursor-text"
                onClick={handleContainerClick}
            >
                <div className="border-b px-4 py-2 bg-gray-50">
                    <MenuBar editor={editor} />
                </div>
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none w-full p-4 min-h-[300px] outline-none [&_*]:outline-none"
                />
            </div>
        </div>
    );
} 
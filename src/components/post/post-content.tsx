import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface PostContentProps {
    content: string;
}

export const PostContent = ({ content }: PostContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowMore, setShouldShowMore] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editable: false,
    });

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                const shouldShow = contentRef.current.scrollHeight > 32;
                setShouldShowMore(shouldShow);
            }
        };

        if (editor) {
            checkHeight();
        }

        const timer = setTimeout(checkHeight, 100);

        return () => clearTimeout(timer);
    }, [editor]);

    return (
        <div>
            <div
                ref={contentRef}
                className={`relative ${!isExpanded ? 'max-h-[36px] overflow-hidden' : ''}`}
            >
                <div className="prose prose-sm max-w-none text-sm">
                    <EditorContent editor={editor} />
                </div>

                {!isExpanded && shouldShowMore && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                )}
            </div>

            {shouldShowMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium mt-1"
                >
                    {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
                </button>
            )}
        </div>
    );
}; 
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '../ui/button';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { SmilePlus } from 'lucide-react';
import { useState } from 'react';

const TiptapEditor = ({ content, setContent }: { content: string, setContent: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4'
                    }
                },
            }),
            Placeholder.configure({
                placeholder: 'Bạn muốn chia sẻ điều gì?',
                emptyNodeClass:
                    'first:before:text-gray-400 first:before:float-lef first:before:h-0 t first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[350px]',
            },
        },
        content: content,
        editable: true,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    })

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const onEmojiClick = (emoji: string) => {
        editor?.commands.insertContent(emoji);
    }

    if (!editor) return null;

    return (
        <div className="prose prose-sm max-w-none [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-4 [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-gray-600 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-2 [&>ul>li]:text-gray-600 text-xl">
            <EditorContent editor={editor} placeholder='Bạn muốn chia sẻ điều gì?' />
            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 hover:bg-gray-100"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <SmilePlus size={20} className="text-gray-500" />
                </Button>
                {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 z-50">
                        <EmojiPicker
                            onEmojiClick={(emoji: any) => onEmojiClick(emoji.emoji)}
                            width={350}
                            height={400}
                            theme={Theme.LIGHT}
                            searchPlaceholder="Search emoji..."
                            lazyLoadEmojis={true}
                            skinTonesDisabled={true}
                            emojiStyle={EmojiStyle.NATIVE}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TiptapEditor; 
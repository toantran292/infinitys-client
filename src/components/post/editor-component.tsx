import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "../ui/button";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { InstagramIcon, SmilePlus } from "lucide-react";
import { useState, useRef, RefObject } from "react";

const TiptapEditor = ({
  content,
  setContent,
  filesRef
}: {
  content: string;
  setContent: (content: string) => void;
  filesRef: RefObject<File[]>;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4"
          }
        }
      }),
      Placeholder.configure({
        placeholder: "Bạn muốn chia sẻ điều gì?",
        emptyNodeClass:
          "first:before:text-gray-400 first:before:float-lef first:before:h-0 t first:before:content-[attr(data-placeholder)] first:before:pointer-events-none"
      })
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[350px]"
      }
    },
    content: content,
    editable: true,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    }
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onEmojiClick = (emoji: string) => {
    editor?.commands.insertContent(emoji);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages((prev) => [...prev, ...newImages]);
      filesRef.current = [...filesRef.current, ...files];
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, index) => index !== indexToRemove);
    });
    filesRef.current = filesRef.current.filter(
      (_, index) => index !== indexToRemove
    );
  };

  if (!editor) return null;

  return (
    <div className="prose prose-sm max-w-none [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-4 [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-gray-600 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-2 [&>ul>li]:text-gray-600 text-xl">
      <div className="max-h-[500px] overflow-y-auto">
        <EditorContent
          editor={editor}
          placeholder="Bạn muốn chia sẻ điều gì?"
        />

        {selectedImages.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-4 border-t pt-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-10 hover:bg-gray-100"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <SmilePlus size={20} className="text-gray-500" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
        <Button
          variant="ghost"
          size="icon"
          className="size-10 hover:bg-gray-100"
          onClick={() => fileInputRef.current?.click()}
        >
          <InstagramIcon size={20} className="text-gray-500" />
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

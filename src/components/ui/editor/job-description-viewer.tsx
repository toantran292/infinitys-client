import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface JobDescriptionViewerProps {
  content: string;
}

export function JobDescriptionViewer({ content }: JobDescriptionViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4"
          }
        }
      })
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none"
      }
    },
    content: content,
    editable: false
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-4 [&>h3]:font-medium [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-gray-600 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-2 [&>ul>li]:text-gray-600">
      <EditorContent editor={editor} />
    </div>
  );
}

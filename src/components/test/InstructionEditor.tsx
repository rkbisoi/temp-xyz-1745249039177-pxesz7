import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';
import { useEffect } from 'react';

interface InstructionEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const InstructionEditor = ({ content, onChange }: InstructionEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        }
      }),
      Placeholder.configure({
        placeholder: 'Enter test instructions...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded overflow-hidden" style={{ width: '100%' }}>
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
      <div 
        className="editor-container" 
        style={{ 
          height: '381px',
          width: '100%'
        }}
      >
        <EditorContent 
          editor={editor} 
          className="p-3 editor-content text-sm" 
          style={{
            height: '100%',
            width: '100%',
            overflow: 'auto'
          }}
        />
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .editor-content .ProseMirror {
            height: 100%;
            width: 100%;
            outline: none !important;
            word-wrap: break-word;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-wrap: break-word;
          }
          .editor-content .ProseMirror:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          .editor-content .ProseMirror ul {
            list-style-type: disc;
            padding-left: 1rem;
          }
          .editor-content .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 1rem;
          }
          .editor-content {
            display: block;
            overflow: auto;
          }
          .editor-content .ProseMirror h1 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .editor-content .ProseMirror h2 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
          }
          .editor-content .ProseMirror p {
            margin-bottom: 0.5rem;
            min-height: 1.5em;
          }
        `
      }} />
    </div>
  );
}

export default InstructionEditor;
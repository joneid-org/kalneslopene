import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Palette,
  Strikethrough,
  Unlink,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { readFileAsDataURL } from "@/lib/utils.ts";
import { requestNewsfeedContentUpload } from "@/api/queries.ts";
import { uploadToS3 } from "@/api/s3.ts";
import { Button } from "@/components/ui/button.tsx";

const COLORS = [
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

const HIGHLIGHT_COLORS = [
  "#fef08a",
  "#bbf7d0",
  "#bfdbfe",
  "#fecaca",
  "#e9d5ff",
  "#fed7aa",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer",
            class: "text-blue-600 underline",
          },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { uploadUrl, s3File } = await requestNewsfeedContentUpload(
        file.name,
      );
      await uploadToS3(file, uploadUrl);
      editor.chain().focus().setImage({ src: s3File.url }).run();
    } finally {
      setUploading(false);
    }
  };

  const openLinkDialog = () => {
    const { from, to } = editor.state.selection;
    setLinkText(editor.state.doc.textBetween(from, to));
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkDialogOpen(true);
  };

  const applyLink = () => {
    const url = linkUrl.trim();
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkDialogOpen(false);
      return;
    }
    const label = linkText.trim() === "" ? url : linkText;
    const { from, to } = editor.state.selection;
    editor
      .chain()
      .focus()
      .insertContentAt({ from, to }, label)
      .setTextSelection({ from, to: from + label.length })
      .setLink({ href: url })
      .run();
    setLinkDialogOpen(false);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b bg-muted/40">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Fet"
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Kursiv"
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Gjennomstrek"
        >
          <Strikethrough className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive("link")}
          onClick={openLinkDialog}
          title="Sett inn lenke"
        >
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Fjern lenke"
        >
          <Unlink className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Venstrejuster"
        >
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Midtstill"
        >
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Høyrejuster"
        >
          <AlignRight className="size-3.5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Punktliste"
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Nummerert liste"
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Text color */}
        <div className="relative flex items-center group" title="Tekstfarge">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
          >
            <Palette className="size-3.5" />
          </Button>
          <div className="absolute top-full left-0 z-10 hidden group-hover:flex flex-wrap gap-1 bg-white border rounded-md shadow-md p-1.5 w-36">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                className="size-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
            <button
              type="button"
              title="Fjern farge"
              className="size-5 rounded-sm border border-gray-200 bg-white hover:scale-110 transition-transform text-[8px] leading-none flex items-center justify-center"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Highlight color */}
        <div className="relative flex items-center group" title="Marker tekst">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
          >
            <Highlighter className="size-3.5" />
          </Button>
          <div className="absolute top-full left-0 z-10 hidden group-hover:flex flex-wrap gap-1 bg-white border rounded-md shadow-md p-1.5 w-28">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                className="size-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() =>
                  editor.chain().focus().setHighlight({ color }).run()
                }
              />
            ))}
            <button
              type="button"
              title="Fjern markering"
              className="size-5 rounded-sm border border-gray-200 bg-white hover:scale-110 transition-transform text-[8px] leading-none flex items-center justify-center"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              ✕
            </button>
          </div>
        </div>

        <Divider />

        {/* Insert image */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          aria-label="Sett inn bilde i tekst"
        />
        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          title="Sett inn bilde"
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <ImagePlus className="size-3.5" />
          )}
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="min-h-40 prose prose-sm max-w-none p-3 focus-within:outline-none text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-35 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-md [&_.ProseMirror_img]:my-2 [&_a]:text-blue-600 [&_a]:underline"
      />

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sett inn lenke</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="link-text">Tekst</Label>
              <Input
                id="link-text"
                placeholder="Ordet som vises"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://eksempel.no"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLinkDialogOpen(false)}
            >
              Avbryt
            </Button>
            <Button type="button" onClick={applyLink}>
              Lagre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="h-7 w-7 p-0"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-border mx-0.5 self-center" />;
}

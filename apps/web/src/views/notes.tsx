import { useState, useCallback } from "react";
import { useNotes, useCreateNote, useDeleteNote } from "@/hooks/use-notes";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileImage, Trash2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import type { Note } from "@workspace/api-client-react";

export default function Notes() {
  const { data: notes, isLoading } = useNotes();
  const createNote = useCreateNote();
  const [uploadingName, setUploadingName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadingName(file.name);

    // Mock upload: Read file as Data URL to store in the DB 
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      createNote.mutate(
        { 
          data: { 
            title: file.name.split('.')[0] || "Untitled Note", 
            imageUrl: base64String 
          } 
        },
        {
          onSettled: () => setUploadingName(null)
        }
      );
    };
    reader.readAsDataURL(file);
  }, [createNote]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="flex flex-col gap-10 h-full pb-10">
      <header>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Notes</h1>
        <p className="text-muted-foreground mt-2 text-base">Capture and store images of your notes, diagrams, and sketches.</p>
      </header>

      {/* Upload Zone */}
      <div 
        {...getRootProps()} 
        className={`
          relative overflow-hidden p-10 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200
          flex flex-col items-center justify-center text-center
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50 bg-card'}
        `}
      >
        <input {...getInputProps()} />
        <div className="bg-secondary p-4 rounded-full mb-4 text-muted-foreground relative">
          <UploadCloud size={28} />
        </div>
        <h3 className="text-lg font-semibold mb-1">
          {isDragActive ? "Drop image here..." : "Click or drag to upload"}
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Supports JPG, PNG, WEBP.
        </p>
        
        {uploadingName && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-medium text-sm text-foreground">Uploading {uploadingName}...</p>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Gallery
          </h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {[1,2,3].map(i => <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-xl"></div>)}
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No notes yet</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Upload an image of your notes to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const deleteNote = useDeleteNote();

  const handleDelete = () => {
    if (confirm("Delete this note?")) {
      deleteNote.mutate({ id: note.id });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <FileImage size={32} className="opacity-20" />
        </div>
        
        {note.imageUrl && (
          <img 
            src={note.imageUrl} 
            alt={note.title} 
            className="w-full h-full object-cover relative z-10"
            loading="lazy"
          />
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center">
          <button 
            onClick={handleDelete}
            disabled={deleteNote.isPending}
            className="p-2.5 bg-background text-foreground rounded-full transform scale-90 group-hover:scale-100 transition-all hover:text-destructive"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground truncate" title={note.title}>
            {note.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(note.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

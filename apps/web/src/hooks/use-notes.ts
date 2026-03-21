// Mock use-notes for now to avoid compilation errors
export interface Note {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
}

interface CreateNoteData {
  data: { title: string; imageUrl?: string };
}

interface MutateOptions {
  onSettled?: () => void;
  onSuccess?: () => void;
}

export function useNotes() {
  return { data: [] as Note[], isLoading: false };
}

export function useCreateNote() {
  return { 
    mutate: (_data: CreateNoteData, _options?: MutateOptions) => {}, 
    isPending: false 
  };
}

export function useUpdateNote() {
  return { 
    mutate: (_data: { id: string; data: Partial<Note> }, _options?: MutateOptions) => {}, 
    isPending: false 
  };
}

export function useDeleteNote() {
  return { 
    mutate: (_data: { id: string }, _options?: MutateOptions) => {}, 
    isPending: false 
  };
}

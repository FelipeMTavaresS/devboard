// Mock use-notes for now to avoid compilation errors
export function useNotes() {
  return { data: [], isLoading: false };
}

export function useCreateNote() {
  return { mutate: () => {}, isPending: false };
}

export function useUpdateNote() {
  return { mutate: () => {}, isPending: false };
}

export function useDeleteNote() {
  return { mutate: () => {}, isPending: false };
}

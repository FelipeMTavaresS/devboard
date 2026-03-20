import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category?: string;
  createdAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  progress?: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

export function useTasks(params?: { search?: string; status?: string }) {
  return useQuery<Task[]>({
    queryKey: ["tasks", params],
    queryFn: async () => {
      let url = `${API_BASE_URL}/tasks`;
      if (params?.status && params.status !== 'all') {
        url = `${API_BASE_URL}/tasks/${params.status}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      
      if (params?.search) {
        return data.filter((t: Task) => 
          t.title.toLowerCase().includes(params.search!.toLowerCase())
        );
      }
      return data;
    },
  });
}

export function useTaskStats() {
  return useQuery<TaskStats>({
    queryKey: ["task-stats"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/tasks/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      return {
        ...data,
        progress: data.total > 0 ? (data.completed / data.total) * 100 : 0
      };
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: Partial<Task> }) => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          priority: data.priority?.toUpperCase() || 'MEDIUM'
        }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update task");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-stats"] });
    },
  });
}

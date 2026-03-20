import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Button, Input, Select, Textarea, Badge } from "@/components/ui-elements";
import { Dialog } from "@/components/dialog";
import { Plus, Search, Filter, Trash2, Check } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, GetTasksStatus, CreateTaskPriority } from "@workspace/api-client-react";

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GetTasksStatus>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tasks, isLoading } = useTasks({ search: search || undefined, status });

  return (
    <div className="flex flex-col gap-8 h-full pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-2 text-base">Manage your goals and to-do list.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={18} />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          <Select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as GetTasksStatus)}
            className="pl-10"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1">
        {isLoading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl"></div>)}
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Check className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No tasks found</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              {search || status !== 'all' 
                ? "We couldn't find any tasks matching your filters." 
                : "Your list is clear. Create a task to get started."}
            </p>
            {(search || status !== 'all') && (
              <Button variant="outline" className="mt-6" onClick={() => { setSearch(''); setStatus('all'); }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateTaskDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleToggle = () => {
    updateTask.mutate({ id: task.id, data: { completed: !task.completed } });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate({ id: task.id });
    }
  };

  const priorityColors = {
    low: "success",
    medium: "warning",
    high: "error"
  } as const;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, duration: 0.2 }}
      className={`
        group relative overflow-hidden p-5 rounded-xl border transition-all duration-200
        ${task.completed ? 'bg-secondary/30 border-transparent' : 'bg-card hover:shadow-sm hover:border-border/80'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox clean design */}
        <button 
          onClick={handleToggle}
          disabled={updateTask.isPending}
          className={`
            flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20
            ${task.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 hover:border-primary text-transparent'}
          `}
        >
          <Check size={12} strokeWidth={3} className={task.completed ? "opacity-100" : "opacity-0"} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-base font-semibold truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">
              {format(new Date(task.createdAt), 'MMM d')}
            </span>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${task.completed ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            {task.category && (
              <Badge variant="default">{task.category}</Badge>
            )}
          </div>
        </div>

        <button 
          onClick={handleDelete}
          disabled={deleteTask.isPending}
          className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function CreateTaskDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CreateTaskPriority>("medium");
  const [category, setCategory] = useState("");
  
  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask.mutate(
      { 
        data: { 
          title: title.trim(), 
          description: description.trim() || undefined, 
          priority, 
          category: category.trim() || undefined 
        } 
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setPriority("medium");
          setCategory("");
          onClose();
        }
      }
    );
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">Task Title</label>
          <Input 
            required 
            placeholder="E.g., Review PR #402" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">Description (Optional)</label>
          <Textarea 
            placeholder="Add some details..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Priority</label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as CreateTaskPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">Category</label>
            <Input 
              placeholder="e.g. Work" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-border/50 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={createTask.isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

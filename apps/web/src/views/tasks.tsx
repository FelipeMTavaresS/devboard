"use client";

import { useState } from "react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import type { Task } from "@/hooks/use-tasks";
import { Button, Input, Select, Textarea, Badge } from "@/components/ui-elements";
import { Dialog } from "@/components/dialog";
import { Plus, Search, Filter, Trash2, Check, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

type GetTasksStatus = "all" | "pending" | "completed";
type CreateTaskPriority = "LOW" | "MEDIUM" | "HIGH";

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GetTasksStatus>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { language, t } = useLanguage();

  const { data: tasks, isLoading } = useTasks({ search: search || undefined, status });

  return (
    <div className="flex flex-col gap-8 h-full pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{t.tasks.title}</h1>
          <p className="text-muted-foreground mt-2 text-base">{t.tasks.subtitle}</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={18} />
          <span>{t.tasks.new_task}</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder={t.tasks.search_placeholder} 
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
            <option value="all">{t.tasks.filters.all}</option>
            <option value="pending">{t.tasks.filters.pending}</option>
            <option value="completed">{t.tasks.filters.completed}</option>
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
            <h3 className="text-xl font-semibold text-foreground">{t.tasks.empty.title}</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              {search || status !== 'all' 
                ? t.tasks.empty.filtered 
                : t.tasks.empty.none}
            </p>
            {(search || status !== 'all') && (
              <Button variant="outline" className="mt-6" onClick={() => { setSearch(''); setStatus('all'); }}>
                {t.tasks.empty.clear}
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const locale = language === 'pt' ? ptBR : enUS;

  const handleToggle = () => {
    updateTask.mutate(
      { id: task.id, data: { completed: !task.completed } },
      {
        onError: () => {
          toast({
            title: t.tasks.toast.update_error,
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDelete = () => {
    if (confirm(t.tasks.delete_confirm)) {
      deleteTask.mutate(
        { id: task.id },
        {
          onSuccess: () => {
            toast({
              title: t.tasks.toast.delete_success,
              variant: "default",
            });
          },
          onError: () => {
            toast({
              title: t.tasks.toast.delete_error,
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const priorityColors = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "error"
  } as const;

  const priorityLabels = {
    LOW: t.tasks.priority.low,
    MEDIUM: t.tasks.priority.medium,
    HIGH: t.tasks.priority.high
  } as const;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`
        group relative overflow-hidden p-5 rounded-xl border transition-all duration-200
        ${task.completed ? 'bg-secondary/30 border-transparent' : 'bg-card hover:shadow-sm hover:border-border/80'}
      `}
    >
      <div className="flex items-start gap-4">
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
              {format(new Date(task.createdAt), "MMM d", { locale })}
            </span>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${task.completed ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
            {task.category && (
              <Badge variant="default">{task.category}</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditDialogOpen(true)}
            className="p-1.5 text-muted-foreground/40 hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex-shrink-0"
            title={language === 'pt' ? 'Editar tarefa' : 'Edit task'}
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0"
            title={language === 'pt' ? 'Excluir tarefa' : 'Delete task'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <EditTaskDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        task={task}
      />
    </motion.div>
  );
}

function CreateTaskDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CreateTaskPriority>("MEDIUM");
  const [category, setCategory] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  
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
          setPriority("MEDIUM");
          setCategory("");
          onClose();
          toast({
            title: t.tasks.toast.create_success,
            variant: "default",
          });
        },
        onError: (error) => {
          const isConnectionError = error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('Failed to fetch');
          
          toast({
            title: isConnectionError 
              ? t.tasks.toast.connection_error 
              : t.tasks.toast.create_error,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.tasks.dialog.title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.dialog.form.title_label}</label>
          <Input 
            required 
            placeholder={t.tasks.dialog.form.title_placeholder} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.dialog.form.desc_label}</label>
          <Textarea 
            placeholder={t.tasks.dialog.form.desc_placeholder} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.priority.label}</label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as CreateTaskPriority)}>
              <option value="LOW">{t.tasks.priority.low}</option>
              <option value="MEDIUM">{t.tasks.priority.medium}</option>
              <option value="HIGH">{t.tasks.priority.high}</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.dialog.form.category_label}</label>
            <Input 
              placeholder={t.tasks.dialog.form.category_placeholder} 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-border/50 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>{t.tasks.dialog.form.cancel}</Button>
          <Button type="submit" isLoading={createTask.isPending}>
            {t.tasks.dialog.form.submit}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function EditTaskDialog({ isOpen, onClose, task }: { isOpen: boolean, onClose: () => void, task: Task }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState(task.category || "");
  const [priority, setPriority] = useState<CreateTaskPriority>(task.priority);
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  const updateTask = useUpdateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask.mutate(
      { 
        id: task.id,
        data: { 
          title: title.trim(), 
          description: description.trim() || undefined,
          category: category.trim() || undefined,
          priority
        } 
      },
      {
        onSuccess: () => {
          onClose();
          toast({
            title: t.tasks.toast.update_success,
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: t.tasks.toast.update_error,
            variant: "destructive",
          });
        }
      }
    );
  };

  const editTitle = language === 'pt' ? 'Editar Tarefa' : 'Edit Task';
  const saveLabel = language === 'pt' ? 'Salvar' : 'Save';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={editTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.dialog.form.title_label}</label>
          <Input 
            required 
            placeholder={t.tasks.dialog.form.title_placeholder} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.dialog.form.desc_label}</label>
          <Textarea 
            placeholder={t.tasks.dialog.form.desc_placeholder} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.priority.label}</label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as CreateTaskPriority)}>
              <option value="LOW">{t.tasks.priority.low}</option>
              <option value="MEDIUM">{t.tasks.priority.medium}</option>
              <option value="HIGH">{t.tasks.priority.high}</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">{t.tasks.dialog.form.category_label}</label>
            <Input 
              placeholder={t.tasks.dialog.form.category_placeholder} 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-border/50 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>{t.tasks.dialog.form.cancel}</Button>
          <Button type="submit" isLoading={updateTask.isPending}>
            {saveLabel}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

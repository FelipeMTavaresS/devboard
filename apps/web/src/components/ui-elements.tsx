import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export function Button({ 
  className = "", 
  variant = "primary", 
  isLoading, 
  children, 
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive", isLoading?: boolean }) {
  
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
    ghost: "bg-transparent hover:bg-secondary text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm text-foreground placeholder:text-muted-foreground ${className}`}
      {...props} 
    />
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={`w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm text-foreground placeholder:text-muted-foreground resize-y ${className}`}
      {...props} 
    />
  );
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select 
      className={`w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm text-foreground appearance-none cursor-pointer ${className}`}
      {...props} 
    >
      {children}
    </select>
  );
}

export function Badge({ children, className = "", variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "success" | "warning" | "error" | "purple" }) {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-rose-100 text-rose-800",
    purple: "bg-violet-100 text-violet-800",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

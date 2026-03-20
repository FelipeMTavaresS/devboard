"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, BookOpen, Hexagon, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

export function Layout({ children }: { children: ReactNode }) {
  const location = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    {
      href: "/dashboard",
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      style: { bottom: 88, right: 22 },
      rotate: -8,
      floatY: [-4, 3, -4],
      floatDuration: 3.2,
    },
    {
      href: "/tasks",
      label: t.nav.tasks,
      icon: CheckSquare,
      style: { bottom: 46, right: 48 },
      rotate: 5,
      floatY: [3, -5, 3],
      floatDuration: 2.8,
    },
    {
      href: "/notes",
      label: t.nav.notes,
      icon: BookOpen,
      style: { bottom: 12, right: 14 },
      rotate: -4,
      floatY: [-3, 4, -3],
      floatDuration: 3.6,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <Hexagon size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">DevBoard</h1>
          </Link>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-secondary/50 hover:bg-secondary transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
            title={language === "en" ? "Switch to Portuguese" : "Mudar para Inglês"}
          >
            <Languages size={14} className="text-primary/70" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>

      {/* Floating Scattered Hex Nav */}
      <nav className="fixed inset-0 pointer-events-none z-50">
        {navItems.map((item, i) => {
          const isActive =
            location === item.href ||
            (item.href !== "/" && location.startsWith(item.href));

          return (
            <motion.div
              key={item.href}
              className="absolute pointer-events-auto group"
              style={{ bottom: item.style.bottom, right: item.style.right }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: item.floatY,
                rotate: item.rotate,
              }}
              transition={{
                opacity: { delay: i * 0.1, duration: 0.4 },
                scale: { delay: i * 0.1, type: "spring", stiffness: 280, damping: 18 },
                y: {
                  repeat: Infinity,
                  duration: item.floatDuration,
                  ease: "easeInOut",
                  delay: i * 0.5,
                },
                rotate: { duration: 0.4, delay: i * 0.1 },
              }}
            >
              <Link href={item.href}>
                <div
                  className={`
                    w-11 h-11 relative flex items-center justify-center cursor-pointer rounded-2xl
                    transition-colors duration-200
                    ${isActive
                      ? "bg-white border border-primary/40 shadow-lg shadow-primary/20"
                      : "bg-white border border-slate-200 shadow-sm hover:border-primary/30"
                    }
                  `}
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 44 44"
                    fill="none"
                  >
                    <polygon
                      points="22,5 37,13.5 37,30.5 22,39 7,30.5 7,13.5"
                      stroke={isActive ? "hsl(248 68% 52%)" : "hsl(248 68% 52% / 0.35)"}
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                  <item.icon
                    size={14}
                    strokeWidth={2.2}
                    className={`relative z-10 ${isActive ? "text-primary" : "text-primary/50"}`}
                  />
                </div>
              </Link>

              <span className="
                absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2
                whitespace-nowrap px-2 py-1 rounded text-xs font-semibold
                bg-foreground text-background shadow
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-150
              ">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}

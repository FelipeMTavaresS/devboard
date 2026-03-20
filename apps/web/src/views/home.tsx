"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Wrench,
  FlaskConical,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: "easeOut" },
});

export default function Home() {
  const { t } = useLanguage();

  const modules = [
    {
      icon: LayoutDashboard,
      href: "/dashboard",
      label: t.nav.dashboard,
      status: t.home.module_status.active,
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      desc: t.dashboard.recent_tasks.see_all, // Simplificação, ou t.home.desc_dashboard
    },
    {
      icon: CheckSquare,
      href: "/tasks",
      label: t.nav.tasks,
      status: t.home.module_status.active,
      statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      desc: t.tasks.subtitle,
    },
    {
      icon: BookOpen,
      href: "/notes",
      label: t.nav.notes,
      status: t.home.module_status.wip,
      statusColor: "bg-amber-100 text-amber-700 border-amber-200",
      desc: t.notes.subtitle,
    },
    {
      icon: FlaskConical,
      href: "#",
      label: t.home.module_status.planned,
      status: t.home.module_status.planned,
      statusColor: "bg-slate-100 text-slate-500 border-slate-200",
      desc: t.home.intro_p1.split('.')[0] + "...", // Placeholder
    },
  ];

  // Re-adjusting descriptions for better consistency
  modules[0].desc = t.dashboard.recent_tasks.see_all + " metrics and progress.";
  modules[3].desc = "Next experiments coming soon.";

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-12 pb-24 pt-4">

      {/* ── Intro ── */}
      <div className="flex flex-col gap-5">
        <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-xs text-muted-foreground">
          <FlaskConical size={13} className="text-primary" />
          <span>{t.home.status}</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.06)} className="text-3xl font-bold text-foreground tracking-tight leading-snug">
          {t.home.title}
        </motion.h1>

        <motion.div {...fadeUp(0.1)} className="flex flex-col gap-3 text-base text-muted-foreground leading-relaxed">
          <p>{t.home.intro_p1}</p>
          <p>{t.home.intro_p2}</p>
        </motion.div>
      </div>

      {/* ── Divider with label ── */}
      <motion.div {...fadeUp(0.18)} className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t.home.what_is_here}
        </span>
        <div className="flex-1 border-t" />
      </motion.div>

      {/* ── Modules ── */}
      <div className="flex flex-col gap-3">
        {modules.map(({ icon: Icon, href, label, status, statusColor, desc }, i) => {
          const isLink = href !== "#";
          const inner = (
            <motion.div
              {...fadeUp(0.2 + i * 0.06)}
              className={`group flex items-start gap-4 p-4 rounded-xl border bg-card transition-all duration-200
                ${isLink ? "hover:shadow-sm hover:border-primary/25 cursor-pointer" : "opacity-60 cursor-default"}`}
            >
              <div className="mt-0.5 bg-secondary p-2 rounded-lg flex-shrink-0">
                <Icon size={16} className="text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">{label}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
                    {status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>

              {isLink && (
                <ArrowRight
                  size={15}
                  className="flex-shrink-0 mt-1 text-muted-foreground/40 group-hover:text-primary transition-colors"
                />
              )}
            </motion.div>
          );

          return isLink
            ? <Link key={label} href={href}>{inner}</Link>
            : <div key={label}>{inner}</div>;
        })}
      </div>

      {/* ── Philosophy note ── */}
      <motion.div
        {...fadeUp(0.48)}
        className="flex items-start gap-3 bg-secondary/60 border rounded-xl px-5 py-4"
      >
        <Wrench size={15} className="flex-shrink-0 mt-0.5 text-primary" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">{t.home.philosophy.label} </span>
          {t.home.philosophy.text}
        </div>
      </motion.div>

      {/* ── Version / log ── */}
      <motion.div {...fadeUp(0.54)} className="flex items-center gap-2 text-xs text-muted-foreground/60">
        <GitBranch size={12} />
        <span>{t.home.version}</span>
      </motion.div>
    </div>
  );
}

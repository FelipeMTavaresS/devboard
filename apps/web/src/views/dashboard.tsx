import { useTaskStats, useTasks } from "@/hooks/use-tasks";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CircleDashed,
  ListTodo,
  ArrowRight,
  CalendarDays,
  Flame,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

export default function Dashboard() {
  const { data: stats } = useTaskStats();
  const { data: allTasks, isLoading } = useTasks({ status: "all" });

  const recent = allTasks?.slice(0, 5) || [];
  const progress = Math.round(stats?.progress || 0);
  const circumference = 2 * Math.PI * 36;

  return (
    <div className="flex flex-col gap-8 pb-16">

      {/* ── Page Header ── */}
      <motion.div {...fadeUp(0)} className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border">
          <Flame size={13} className="text-primary" />
          <span>Studying in progress</span>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total"
          value={stats?.total ?? "—"}
          icon={<ListTodo size={16} />}
          color="text-primary"
          bg="bg-primary/8"
          delay={0.1}
        />
        <StatCard
          label="Done"
          value={stats?.completed ?? "—"}
          icon={<CheckCircle2 size={16} />}
          color="text-emerald-600"
          bg="bg-emerald-50"
          delay={0.15}
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? "—"}
          icon={<CircleDashed size={16} />}
          color="text-amber-500"
          bg="bg-amber-50"
          delay={0.2}
        />
      </div>

      {/* ── Body Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Progress ring */}
        <motion.div
          {...fadeUp(0.3)}
          className="bg-card border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Completion
          </p>

          <div className="relative w-32 h-32">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--secondary))" strokeWidth="7" />
              <motion.circle
                cx="40" cy="40" r="36" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${(progress / 100) * circumference} ${circumference}` }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{progress}%</span>
              <span className="text-[10px] text-muted-foreground font-medium">of tasks</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <BarRow label="Done" count={stats?.completed || 0} total={stats?.total || 1} color="bg-emerald-500" />
            <BarRow label="Pending" count={stats?.pending || 0} total={stats?.total || 1} color="bg-amber-400" />
          </div>
        </motion.div>

        {/* Recent tasks */}
        <motion.div
          {...fadeUp(0.35)}
          className="lg:col-span-2 bg-card border rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold text-sm text-foreground">Recent Tasks</h2>
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              See all <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ListTodo size={32} className="text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
              <Link href="/tasks" className="mt-2 text-xs text-primary hover:underline">Create your first task</Link>
            </div>
          ) : (
            <ul className="divide-y">
              {recent.map((task, i) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-secondary/40 transition-colors"
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${task.completed ? "border-emerald-500 bg-emerald-50" : "border-amber-400 bg-amber-50"}`}>
                    {task.completed
                      ? <CheckCircle2 size={11} className="text-emerald-600" />
                      : <CircleDashed size={11} className="text-amber-500" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CalendarDays size={10} />
                        {format(new Date(task.createdAt), "MMM d")}
                      </span>
                      {task.category && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary/8 text-primary">
                          {task.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full
                    ${task.completed
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, color, bg, delay,
}: {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; bg: string; delay: number;
}) {
  return (
    <motion.div {...fadeUp(delay)} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`${bg} ${color} p-1.5 rounded-lg`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        />
      </div>
    </div>
  );
}

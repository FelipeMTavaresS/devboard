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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: "easeOut" },
});

const modules = [
  {
    icon: LayoutDashboard,
    href: "/dashboard",
    label: "Dashboard",
    status: "ativo",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    desc: "Métricas de progresso, taxa de conclusão e atividade recente das tarefas.",
  },
  {
    icon: CheckSquare,
    href: "/tasks",
    label: "Tasks",
    status: "ativo",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    desc: "CRUD completo de tarefas com categorias, filtros e controle de status.",
  },
  {
    icon: BookOpen,
    href: "/notes",
    label: "Notes",
    status: "em construção",
    statusColor: "bg-amber-100 text-amber-700 border-amber-200",
    desc: "Upload de imagens de cadernos. OCR planejado para versões futuras.",
  },
  {
    icon: FlaskConical,
    href: "#",
    label: "Próximo experimento",
    status: "planejado",
    statusColor: "bg-slate-100 text-slate-500 border-slate-200",
    desc: "Ainda não sei o que vai ser — faz parte do processo.",
  },
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-12 pb-24 pt-4">

      {/* ── Intro ── */}
      <div className="flex flex-col gap-5">
        <motion.div {...fadeUp(0)} className="flex items-center gap-2 text-xs text-muted-foreground">
          <FlaskConical size={13} className="text-primary" />
          <span>projeto de estudo em andamento</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.06)} className="text-3xl font-bold text-foreground tracking-tight leading-snug">
          DevBoard
        </motion.h1>

        <motion.div {...fadeUp(0.1)} className="flex flex-col gap-3 text-base text-muted-foreground leading-relaxed">
          <p>
            Esse projeto não tem um objetivo fixo. A ideia é ir construindo à medida que estudo —
            cada coisa nova que aprendo, testo aqui dentro. O resultado é um
            <span className="text-foreground font-medium"> conjunto crescente de experimentos</span>:
            funcionalidades independentes que coexistem e evoluem ao longo do tempo.
          </p>
          <p>
            Começou como um gerenciador de tarefas. Vai se tornando o que o aprendizado pedir.
          </p>
        </motion.div>
      </div>

      {/* ── Divider with label ── */}
      <motion.div {...fadeUp(0.18)} className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          O que tem aqui
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
          <span className="font-semibold text-foreground">Filosofia do projeto: </span>
          construir primeiro, refinar depois. Se uma ideia parece relevante de implementar,
          ela entra aqui — o projeto cresce de forma orgânica, guiado pelo aprendizado.
        </div>
      </motion.div>

      {/* ── Version / log ── */}
      <motion.div {...fadeUp(0.54)} className="flex items-center gap-2 text-xs text-muted-foreground/60">
        <GitBranch size={12} />
        <span>v0.1 · em desenvolvimento contínuo</span>
      </motion.div>
    </div>
  );
}

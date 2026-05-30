import React from "react";
import { Task } from "@/types/task";
import { CheckCircle, Clock, Percent, ListTodo } from "lucide-react";

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Barra de Progresso Principal com Estética Fluida */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-md">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Progresso Geral</span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          {total === 0 
            ? "Nenhuma tarefa cadastrada para hoje." 
            : `${completed} de ${total} tarefas concluídas! Continue assim.`}
        </p>
      </div>

      {/* Grid de Contadores Rápidos */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-500 rounded-xl mb-1">
            <ListTodo size={14} />
          </div>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{total}</span>
          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Criadas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950 text-rose-500 rounded-xl mb-1">
            <Clock size={14} />
          </div>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{pending}</span>
          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pendentes</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-xl mb-1">
            <CheckCircle size={14} />
          </div>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{completed}</span>
          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Concluídas</span>
        </div>
      </div>
    </div>
  );
}
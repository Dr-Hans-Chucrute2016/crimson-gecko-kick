import React, { useState } from "react";
import { PlusCircle, Calendar, Tag, Sparkles } from "lucide-react";

interface TaskFormProps {
  onAdd: (title: string, dueDate: string, priority: "low" | "medium" | "high") => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  // Data de hoje como padrão para due_date
  const [dueDate, setDueDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), dueDate, priority);
    setTitle("");
    setIsExpanded(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-md transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Input de Título Principal */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Adicionar nova tarefa..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isExpanded) setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
            className="w-full text-sm border-none bg-slate-50 dark:bg-slate-950 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            required
          />
          {!isExpanded && (
            <button
              type="submit"
              disabled={!title.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>

        {/* Campos extras ao expandir */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {/* Campo Data */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-1">
                  <Calendar size={10} /> Data de Conclusão
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Campo Prioridade */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 mb-1">
                  <Tag size={10} /> Prioridade
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">🟢 Baixa</option>
                  <option value="medium">🟡 Média</option>
                  <option value="high">🔴 Alta</option>
                </select>
              </div>
            </div>

            {/* Ações adicionais */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shadow-indigo-200 dark:shadow-none"
              >
                <Sparkles size={12} /> Adicionar
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
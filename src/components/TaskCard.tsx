import React, { useState } from "react";
import { Task } from "@/types/task";
import { Calendar, CheckCircle2, Circle, Edit2, Trash2, Check, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, currentStatus: "pending" | "completed") => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, dueDate: string, priority: "low" | "medium" | "high") => void;
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(task.due_date);
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(task.priority || "medium");

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(task.id, editTitle, editDueDate, editPriority);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDueDate(task.due_date);
    setEditPriority(task.priority || "medium");
    setIsEditing(false);
  };

  // Formatar data para exibição (pt-BR)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Definir cores das prioridades
  const getPriorityBadge = (p?: string) => {
    switch (p) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none rounded-full text-[10px] px-2 py-0.5">Alta</Badge>;
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none rounded-full text-[10px] px-2 py-0.5">Média</Badge>;
      default:
        return <Badge className="bg-teal-500 hover:bg-teal-600 text-white border-none rounded-full text-[10px] px-2 py-0.5">Baixa</Badge>;
    }
  };

  const isOverdue = new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0)) && task.status === "pending";

  return (
    <div
      className={`relative overflow-hidden bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-300 ${
        task.status === "completed"
          ? "border-emerald-100 dark:border-emerald-950 shadow-sm bg-slate-50/50 dark:bg-slate-950/20"
          : isOverdue
          ? "border-rose-200 dark:border-rose-950 shadow-md ring-1 ring-rose-100 dark:ring-rose-950/30"
          : "border-slate-100 dark:border-slate-800 shadow-md hover:shadow-lg"
      }`}
    >
      {/* Indicador de atraso */}
      {isOverdue && (
        <div className="absolute top-0 right-0 left-0 bg-rose-500 text-white text-[10px] font-semibold text-center py-0.5 flex items-center justify-center gap-1">
          <AlertTriangle size={10} /> Tarefa atrasada!
        </div>
      )}

      {isEditing ? (
        <div className={`space-y-3 ${isOverdue ? "pt-3" : ""}`}>
          <div>
            <label className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Título da Tarefa</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nome da tarefa"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Conclusão</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Prioridade</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as any)}
                className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all font-medium"
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all font-medium"
            >
              <Check size={14} /> Salvar
            </button>
          </div>
        </div>
      ) : (
        <div className={`flex items-start gap-3 ${isOverdue ? "pt-4" : ""}`}>
          <button
            onClick={() => onToggle(task.id, task.status)}
            className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform active:scale-95"
          >
            {task.status === "completed" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Circle className="w-6 h-6 hover:stroke-indigo-500 text-slate-300 dark:text-slate-600" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold text-sm leading-tight break-words text-slate-800 dark:text-slate-100 ${
                task.status === "completed" ? "line-through text-slate-400 dark:text-slate-500" : ""
              }`}
            >
              {task.title}
            </h4>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <Calendar size={12} className="text-slate-400" />
                <span>{formatDate(task.due_date)}</span>
              </span>
              {getPriorityBadge(task.priority)}
            </div>
          </div>

          <div className="flex items-center gap-1 self-start ml-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
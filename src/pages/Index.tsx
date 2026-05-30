import React, { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import TaskForm from "@/components/TaskForm";
import TaskStats from "@/components/TaskStats";
import TaskCard from "@/components/TaskCard";
import SupabaseGuide from "@/components/SupabaseGuide";
import { MadeWithDyad } from "@/components/made-with-dyad";
import {
  ListTodo,
  CheckCircle,
  Database,
  CloudLightning,
  AlertCircle,
  Search,
  BookOpen,
  X,
} from "lucide-react";

export default function Index() {
  const {
    tasks,
    loading,
    usingSupabase,
    addTask,
    toggleTaskStatus,
    editTask,
    deleteTask,
    fetchTasks,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  // Filtrar e buscar tarefas
  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && task.status === "pending") ||
      (activeTab === "completed" && task.status === "completed");

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-4 px-2 md:py-8">
      {/* Container Principal Mobile-First */}
      <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950 md:bg-white md:dark:bg-slate-900 md:shadow-xl md:rounded-3xl md:border md:border-slate-100 md:dark:border-slate-800 overflow-hidden min-h-[92vh] flex flex-col justify-between">
        
        {/* Cabeçalho */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <ListTodo size={22} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                  TaskSync
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  Mobile Task Manager
                </p>
              </div>
            </div>

            {/* Status do Banco de Dados */}
            <button
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                usingSupabase
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              }`}
            >
              {usingSupabase ? (
                <>
                  <Database size={10} /> Live Supabase
                </>
              ) : (
                <>
                  <CloudLightning size={10} /> Local Fallback
                </>
              )}
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* Estatísticas Rápidas */}
          <TaskStats tasks={tasks} />

          {/* Botão de Tutorial/Guia */}
          {!usingSupabase && !showConfigGuide && (
            <button
              onClick={() => setShowConfigGuide(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 dark:text-indigo-400 text-xs font-semibold rounded-xl border border-indigo-100 dark:border-indigo-900/50 transition-all"
            >
              <BookOpen size={14} /> Como conectar meu Supabase?
            </button>
          )}

          {/* Guia do Supabase Ativo */}
          {showConfigGuide && (
            <div className="relative pt-2">
              <button
                onClick={() => setShowConfigGuide(false)}
                className="absolute right-2 top-4 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors z-10"
              >
                <X size={14} />
              </button>
              <SupabaseGuide />
            </div>
          )}

          {/* Formulário de Adicionar Tarefa */}
          <TaskForm onAdd={addTask} />
        </div>

        {/* Seção das Abas de Filtragem */}
        <div className="px-4">
          <div className="flex gap-1 bg-slate-100/80 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              Todas ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "pending"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              Pendentes ({tasks.filter((t) => t.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "completed"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
              }`}
            >
              Concluídas ({tasks.filter((t) => t.status === "completed").length})
            </button>
          </div>
        </div>

        {/* Lista de Tarefas com Scroll Suave */}
        <div className="flex-1 p-4 overflow-y-auto max-h-[450px] space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Carregando tarefas...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-100/30 dark:bg-slate-900/30 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
              <CheckCircle className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2 animate-bounce" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto">
                Crie uma nova tarefa acima ou mude seus filtros de pesquisa.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTaskStatus}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            ))
          )}
        </div>

        {/* Rodapé e créditos */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            TaskSync v1.0.0 • Mobile-First CRUD
          </p>
          <MadeWithDyad />
        </div>

      </div>
    </div>
  );
}
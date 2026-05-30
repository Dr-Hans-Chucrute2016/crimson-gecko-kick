import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Task } from "@/types/task";
import { showSuccess, showError } from "@/utils/toast";

const LOCAL_STORAGE_KEY = "dyad_tasks_fallback";

const initialMockTasks: Task[] = [
  {
    id: "1",
    title: "Comprar ingredientes para o jantar",
    status: "completed",
    due_date: new Date().toISOString().split("T")[0],
    priority: "medium",
  },
  {
    id: "2",
    title: "Estudar conceitos de Mobile-First",
    status: "pending",
    due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    priority: "high",
  },
  {
    id: "3",
    title: "Configurar variáveis de ambiente do Supabase",
    status: "pending",
    due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    priority: "high",
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSupabase, setUsingSupabase] = useState(isSupabaseConfigured);

  // Carregar tarefas
  const fetchTasks = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTasks(data || []);
        setUsingSupabase(true);
      } catch (err: any) {
        console.error("Erro ao carregar do Supabase, usando fallback local:", err);
        loadLocalTasks();
        setUsingSupabase(false);
      } finally {
        setLoading(false);
      }
    } else {
      loadLocalTasks();
      setUsingSupabase(false);
      setLoading(false);
    }
  };

  const loadLocalTasks = () => {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      setTasks(JSON.parse(local));
    } else {
      setTasks(initialMockTasks);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMockTasks));
    }
  };

  const saveLocalTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Adicionar tarefa
  const addTask = async (title: string, dueDate: string, priority: "low" | "medium" | "high" = "medium") => {
    const newTaskObj: Omit<Task, "id" | "created_at"> = {
      title,
      status: "pending",
      due_date: dueDate,
      priority,
    };

    if (usingSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert([newTaskObj])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setTasks((prev) => [data[0], ...prev]);
          showSuccess("Tarefa adicionada com sucesso no Supabase!");
        }
      } catch (err: any) {
        showError("Erro ao salvar no Supabase. Salvando localmente.");
        saveLocalToFallback(newTaskObj);
      }
    } else {
      saveLocalToFallback(newTaskObj);
      showSuccess("Tarefa adicionada localmente (Modo de Demonstração)!");
    }
  };

  const saveLocalToFallback = (newTaskObj: Omit<Task, "id">) => {
    const created: Task = {
      ...newTaskObj,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      created_at: new Date().toISOString(),
    };
    const updated = [created, ...tasks];
    saveLocalTasks(updated);
  };

  // Alternar status da tarefa
  const toggleTaskStatus = async (id: string, currentStatus: "pending" | "completed") => {
    const nextStatus = currentStatus === "pending" ? "completed" : "pending";

    if (usingSupabase && supabase) {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ status: nextStatus })
          .eq("id", id);

        if (error) throw error;
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
        );
        showSuccess(`Tarefa marcada como ${nextStatus === "completed" ? "concluída" : "pendente"}!`);
      } catch (err: any) {
        showError("Erro ao atualizar status no Supabase.");
      }
    } else {
      const updated = tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t));
      saveLocalTasks(updated);
      showSuccess(`Status atualizado para ${nextStatus === "completed" ? "concluído" : "pendente"}!`);
    }
  };

  // Editar tarefa completa
  const editTask = async (id: string, title: string, dueDate: string, priority: "low" | "medium" | "high") => {
    if (usingSupabase && supabase) {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ title, due_date: dueDate, priority })
          .eq("id", id);

        if (error) throw error;
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, title, due_date: dueDate, priority } : t))
        );
        showSuccess("Tarefa atualizada com sucesso!");
      } catch (err: any) {
        showError("Erro ao salvar alterações no Supabase.");
      }
    } else {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, title, due_date: dueDate, priority } : t
      );
      saveLocalTasks(updated);
      showSuccess("Tarefa editada localmente!");
    }
  };

  // Excluir tarefa
  const deleteTask = async (id: string) => {
    if (usingSupabase && supabase) {
      try {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) throw error;
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showSuccess("Tarefa excluída com sucesso do Supabase!");
      } catch (err: any) {
        showError("Erro ao excluir tarefa do Supabase.");
      }
    } else {
      const updated = tasks.filter((t) => t.id !== id);
      saveLocalTasks(updated);
      showSuccess("Tarefa excluída localmente!");
    }
  };

  return {
    tasks,
    loading,
    usingSupabase,
    fetchTasks,
    addTask,
    toggleTaskStatus,
    editTask,
    deleteTask,
  };
}
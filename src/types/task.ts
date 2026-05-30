export interface Task {
  id: string; // uuid no supabase ou string randômica no mock
  title: string;
  status: "pending" | "completed";
  due_date: string; // 'data conclusão' em formato YYYY-MM-DD
  created_at?: string;
  priority?: "low" | "medium" | "high";
}
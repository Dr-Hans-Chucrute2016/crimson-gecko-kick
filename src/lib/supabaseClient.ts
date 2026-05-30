import { createClient } from "@supabase/supabase-js";

// Lemos as variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Exportamos uma verificação se o Supabase está configurado corretamente
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== "" && 
  supabaseAnonKey.trim() !== "" &&
  !supabaseUrl.includes("YOUR_") &&
  !supabaseAnonKey.includes("YOUR_");

// Criamos o cliente apenas se estiver configurado para evitar erros de inicialização
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
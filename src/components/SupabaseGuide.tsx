import React from "react";
import { Terminal, Database, CheckCircle, Copy, AlertCircle } from "lucide-react";
import { showSuccess } from "@/utils/toast";

export default function SupabaseGuide() {
  const [copied, setCopied] = React.useState(false);

  const envTemplate = `VITE_SUPABASE_URL=seu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key_aqui`;

  const sqlTemplate = `-- Código SQL para criar a tabela no editor SQL do Supabase
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  status text not null default 'pending',
  due_date date not null,
  priority text default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar Row Level Security (opcional ou liberar para anon para teste rápido)
alter table tasks enable row level security;
create policy "Acesso público total para fins de demonstração" on tasks
  for all using (true) with check (true);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copiado para a área de transferência!");
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500 rounded-xl text-white">
          <Database size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Integração com Supabase</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Como conectar seu banco de dados em segundos</p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
        <p>
          Este CRUD detectará automaticamente a conexão ativa. Siga os passos abaixo:
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-full flex items-center justify-center text-xs">1</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Configure o arquivo <code className="bg-indigo-100/50 px-1 py-0.5 rounded text-indigo-700">.env</code></p>
              <p className="text-slate-500 text-[11px] mb-1">Crie um arquivo na raiz do seu projeto com as chaves:</p>
              <div className="relative mt-1">
                <pre className="bg-slate-950 text-slate-200 p-2.5 rounded-lg overflow-x-auto font-mono text-[10px] leading-relaxed">
                  {envTemplate}
                </pre>
                <button
                  onClick={() => copyToClipboard(envTemplate)}
                  className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-all"
                  title="Copiar .env"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-full flex items-center justify-center text-xs">2</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Crie a tabela no Supabase</p>
              <p className="text-slate-500 text-[11px] mb-1">Abra o SQL Editor no seu painel do Supabase e execute:</p>
              <div className="relative mt-1">
                <pre className="bg-slate-950 text-slate-200 p-2.5 rounded-lg overflow-x-auto font-mono text-[9px] max-h-40 overflow-y-auto leading-relaxed">
                  {sqlTemplate}
                </pre>
                <button
                  onClick={() => copyToClipboard(sqlTemplate)}
                  className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-all"
                  title="Copiar SQL"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
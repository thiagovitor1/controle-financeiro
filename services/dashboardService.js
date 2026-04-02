import { supabase } from "../lib/supabase";

export async function loadDashboardResumo() {
  if (!supabase) return null;

  const [{ data: fixed }, { data: variable }, { data: cards }, { data: debts }] =
    await Promise.all([
      supabase.from("fixed_expenses").select("*").eq("active", true),
      supabase.from("variable_expenses").select("*"),
      supabase.from("cards").select("*"),
      supabase.from("debts").select("*").eq("active", true),
    ]);

  const totalFixos = (fixed || []).reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalVariaveis = (variable || []).reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalDividas = (debts || []).reduce((s, i) => s + Number(i.monthly_amount || 0), 0);

  return {
    totalFixos,
    totalVariaveis,
    totalCartoes: (cards || []).length,
    totalDividas,
    qtdFixos: (fixed || []).length,
    qtdVariaveis: (variable || []).length,
    qtdDividas: (debts || []).length,
  };
}

"use client";

import { useEffect, useState } from "react";
import PageShell from "../components/shared/PageShell";
import { moeda } from "../lib/format";
import { loadDashboardResumo } from "../services/dashboardService";

const fallback = {
  totalFixos: 0,
  totalVariaveis: 0,
  totalCartoes: 0,
  totalDividas: 0,
  qtdFixos: 0,
  qtdVariaveis: 0,
  qtdDividas: 0,
};

export default function HomePage() {
  const [resumo, setResumo] = useState(fallback);

  useEffect(() => {
    loadDashboardResumo().then((data) => {
      if (data) setResumo(data);
    });
  }, []);

  const saidasMes = resumo.totalFixos + resumo.totalVariaveis + resumo.totalDividas;

  return (
    <PageShell
      title="Visão geral do mês"
      subtitle="Uma leitura rápida da sua situação atual e da estrutura principal do app."
    >
      <section className="card">
        <h2 className="sectionTitle">Resumo do mês</h2>
        <div className="grid2">
          <div className="stat">
            <div className="statLabel">Gastos fixos</div>
            <div className="statValue">{moeda(resumo.totalFixos)}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Gastos variáveis</div>
            <div className="statValue">{moeda(resumo.totalVariaveis)}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Dívidas mensais</div>
            <div className="statValue">{moeda(resumo.totalDividas)}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Saídas base</div>
            <div className="statValue">{moeda(saidasMes)}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Módulos centrais</h2>
        <div className="grid1">
          <div className="listItem rowBetween">
            <div>
              <div className="listTitle">Gastos Fixos</div>
              <div className="muted">{resumo.qtdFixos} item(ns) ativos</div>
            </div>
            <div className="statValue">{moeda(resumo.totalFixos)}</div>
          </div>
          <div className="listItem rowBetween">
            <div>
              <div className="listTitle">Gastos Variáveis</div>
              <div className="muted">{resumo.qtdVariaveis} lançamento(s)</div>
            </div>
            <div className="statValue">{moeda(resumo.totalVariaveis)}</div>
          </div>
          <div className="listItem rowBetween">
            <div>
              <div className="listTitle">Cartões</div>
              <div className="muted">{resumo.totalCartoes} cartão(ões)</div>
            </div>
            <div className="statValue">{resumo.totalCartoes}</div>
          </div>
          <div className="listItem rowBetween">
            <div>
              <div className="listTitle">Dívidas</div>
              <div className="muted">{resumo.qtdDividas} dívida(s) ativa(s)</div>
            </div>
            <div className="statValue">{moeda(resumo.totalDividas)}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="sectionTitle">Próximo passo</h2>
        <p className="muted" style={{ margin: 0 }}>
          A implementação oficial começou com a base do app pronta. Agora o caminho natural é
          fechar primeiro o módulo de Cartões, depois Fixos, Variáveis e Dívidas.
        </p>
      </section>
    </PageShell>
  );
}

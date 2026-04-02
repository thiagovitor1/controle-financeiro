"use client";

import PageShell from "../../components/shared/PageShell";

export default function FixosPage() {
  return (
    <PageShell
      title="Gastos Fixos"
      subtitle="Tudo o que forma a base do mês: faculdade, pensão, moradia, serviços, seguros e recorrências."
    >
      <section className="card">
        <h2 className="sectionTitle">Estrutura inicial</h2>
        <div className="listItem">
          <div className="listTitle">Objetivo do módulo</div>
          <div className="muted">
            Cadastrar valores recorrentes, vencimento, conta vinculada e impacto automático
            na projeção dos próximos meses.
          </div>
        </div>
      </section>
    </PageShell>
  );
}
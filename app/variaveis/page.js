"use client";

import PageShell from "../../components/shared/PageShell";

export default function VariaveisPage() {
  return (
    <PageShell
      title="Gastos Variáveis"
      subtitle="Lançamentos do dia a dia que mudam de valor e frequência e mostram o comportamento real do mês."
    >
      <section className="card">
        <h2 className="sectionTitle">Estrutura inicial</h2>
        <div className="listItem">
          <div className="listTitle">Objetivo do módulo</div>
          <div className="muted">
            Registrar mercado, farmácia, lazer, compras avulsas e outros gastos que afetam
            o saldo em tempo real.
          </div>
        </div>
      </section>
    </PageShell>
  );
}

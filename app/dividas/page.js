"use client";

import PageShell from "../../components/shared/PageShell";

export default function DividasPage() {
  return (
    <PageShell
      title="Dívidas"
      subtitle="Compromissos parcelados e obrigações de médio e longo prazo que pesam nos próximos meses."
    >
      <section className="card">
        <h2 className="sectionTitle">Estrutura inicial</h2>
        <div className="listItem">
          <div className="listTitle">Objetivo do módulo</div>
          <div className="muted">
            Controlar financiamento, empréstimos, renegociações, parcelas e impacto mensal.
          </div>
        </div>
      </section>
    </PageShell>
  );
}

"use client";

import PageShell from "../../components/shared/PageShell";

export default function CartoesPage() {
  return (
    <PageShell
      title="Cartões"
      subtitle="Módulo oficial para evoluir parcelamento real, primeira fatura, antecipação e leitura por mês."
    >
      <section className="card">
        <h2 className="sectionTitle">Status do módulo</h2>
        <div className="listItem">
          <div className="listTitle">Pronto para evolução</div>
          <div className="muted">
            Esta página já está separada como módulo oficial. O próximo passo é plugar a versão
            funcional completa que vocês já começaram a construir.
          </div>
        </div>
      </section>
    </PageShell>
  );
}

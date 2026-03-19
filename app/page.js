"use client";

import { useMemo, useState } from "react";

const money = (v) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));

const meses = [
  "Janeiro 2026",
  "Fevereiro 2026",
  "Março 2026",
  "Abril 2026",
  "Maio 2026",
  "Junho 2026",
];

const contasFixas = 2430.22;
const dividas = 1984.55;
const gastosVariaveis = 1102.17;
const receitas = 6894.07;
const saldoContas = 115.13;

const sampleCards = [
  { id: 1, nome: "Nubank", limite: 5000, fechamento: 10, vencimento: 17 },
  { id: 2, nome: "Itaú Azul", limite: 3500, fechamento: 5, vencimento: 12 },
];

const samplePurchases = [
  {
    id: 1,
    cartaoId: 1,
    descricao: "Supermercado",
    valor: 480,
    parcelas: 1,
    atual: 1,
    antecipadas: 0,
    data: "2026-03-08",
    categoria: "Mercado",
    observacao: "Compra do mês",
  },
  {
    id: 2,
    cartaoId: 1,
    descricao: "Notebook",
    valor: 3600,
    parcelas: 12,
    atual: 3,
    antecipadas: 0,
    data: "2026-01-20",
    categoria: "Tecnologia",
    observacao: "Uso pessoal e trabalho",
  },
  {
    id: 3,
    cartaoId: 2,
    descricao: "Passagem aérea",
    valor: 1200,
    parcelas: 6,
    atual: 2,
    antecipadas: 1,
    data: "2026-02-10",
    categoria: "Viagem",
    observacao: "Visita familiar",
  },
];

function cardName(cards, id) {
  return cards.find((c) => c.id === Number(id))?.nome || "-";
}

function parcelaAtualTexto(compra) {
  return `${compra.atual}/${compra.parcelas}`;
}

function parcelasRestantes(compra) {
  return Math.max(compra.parcelas - compra.atual - compra.antecipadas, 0);
}

function valorParcela(compra) {
  return compra.valor / compra.parcelas;
}

function statusCompra(compra) {
  const restantes = parcelasRestantes(compra);
  if (compra.parcelas === 1) return "À vista";
  if (restantes === 0) return "Quitando";
  return `${restantes} restantes`;
}

function resumoPorCartao(cards, purchases) {
  return cards.map((cartao) => {
    const compras = purchases.filter((p) => p.cartaoId === cartao.id);
    const totalCompras = compras.reduce((s, p) => s + p.valor, 0);
    const faturaAtual = compras.reduce((s, p) => {
      if (p.parcelas === 1) return s + p.valor;
      return s + valorParcela(p);
    }, 0);
    const usado = compras.reduce((s, p) => s + (p.parcelas === 1 ? 0 : valorParcela(p) * parcelasRestantes(p)), 0) + faturaAtual;
    const disponivel = Math.max(cartao.limite - usado, 0);
    return {
      ...cartao,
      compras,
      totalCompras,
      faturaAtual,
      usado,
      disponivel,
    };
  });
}

export default function Page() {
  const [aba, setAba] = useState("cartoes");
  const [mes, setMes] = useState(meses[2]);
  const [cards, setCards] = useState(sampleCards);
  const [purchases, setPurchases] = useState(samplePurchases);
  const [toast, setToast] = useState("");

  const [novoCartao, setNovoCartao] = useState({ nome: "", limite: "", fechamento: "", vencimento: "" });
  const [novaCompra, setNovaCompra] = useState({ cartaoId: "", descricao: "", valor: "", parcelas: "1", data: "", categoria: "", observacao: "" });
  const [filtro, setFiltro] = useState({ cartaoId: "", descricao: "" });
  const [antecipar, setAntecipar] = useState({ compraId: "", quantidade: "" });

  const totalFatura = purchases.reduce((s, p) => s + (p.parcelas === 1 ? p.valor : valorParcela(p)), 0);
  const totalLimite = cards.reduce((s, c) => s + c.limite, 0);
  const totalCompras = purchases.reduce((s, p) => s + p.valor, 0);

  const cardsResumo = useMemo(() => resumoPorCartao(cards, purchases), [cards, purchases]);

  const comprasFiltradas = purchases.filter((p) => {
    const matchCard = filtro.cartaoId ? p.cartaoId === Number(filtro.cartaoId) : true;
    const matchDesc = filtro.descricao ? p.descricao.toLowerCase().includes(filtro.descricao.toLowerCase()) : true;
    return matchCard && matchDesc;
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const salvarCartao = (e) => {
    e.preventDefault();
    if (!novoCartao.nome || !novoCartao.limite || !novoCartao.fechamento || !novoCartao.vencimento) return;
    setCards((prev) => [...prev, { id: Date.now(), nome: novoCartao.nome, limite: Number(novoCartao.limite), fechamento: Number(novoCartao.fechamento), vencimento: Number(novoCartao.vencimento) }]);
    setNovoCartao({ nome: "", limite: "", fechamento: "", vencimento: "" });
    showToast("Cartão salvo com sucesso.");
  };

  const salvarCompra = (e) => {
    e.preventDefault();
    if (!novaCompra.cartaoId || !novaCompra.descricao || !novaCompra.valor || !novaCompra.parcelas) return;
    setPurchases((prev) => [...prev, { id: Date.now(), cartaoId: Number(novaCompra.cartaoId), descricao: novaCompra.descricao, valor: Number(novaCompra.valor), parcelas: Number(novaCompra.parcelas), atual: 1, antecipadas: 0, data: novaCompra.data || "2026-03-16", categoria: novaCompra.categoria || "Sem categoria", observacao: novaCompra.observacao || "" }]);
    setNovaCompra({ cartaoId: "", descricao: "", valor: "", parcelas: "1", data: "", categoria: "", observacao: "" });
    showToast("Compra adicionada com sucesso.");
  };

  const anteciparParcelas = (compraId, qtd) => {
    setPurchases((prev) =>
      prev.map((p) => {
        if (p.id !== Number(compraId)) return p;
        const max = parcelasRestantes(p);
        const add = Math.min(Number(qtd), max);
        return { ...p, antecipadas: p.antecipadas + add };
      })
    );
    showToast(`${qtd} parcela(s) antecipada(s).`);
  };

  const excluirCompra = (id) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    showToast("Compra excluída.");
  };

  const nav = [
    ["inicio", "Início"],
    ["contas", "Contas"],
    ["lancar", "Lançar"],
    ["cartoes", "Cartões"],
    ["mais", "Mais"],
  ];

  return (
    <main style={styles.bg}>
      <div style={styles.wrap}>
        {toast ? <div style={styles.toast}>{toast}</div> : null}
        {aba === "cartoes" ? (
          <>
            <section style={styles.hero}>
              <div style={styles.badge}>Controle Financeiro • V3.6</div>
              <h1 style={styles.title}>Cartões</h1>
              <p style={styles.subtitle}>Gestão real de cartões, compras, parcelamentos e antecipações.</p>
            </section>

            <div style={styles.monthRow}>
              <div>
                <div style={styles.label}>Mês principal</div>
                <select value={mes} onChange={(e) => setMes(e.target.value)} style={styles.select}>
                  {meses.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <section style={styles.grid4}>
              <SummaryCard title="Fatura estimada" value={money(totalFatura)} highlight />
              <SummaryCard title="Limite total" value={money(totalLimite)} />
              <SummaryCard title="Total em compras" value={money(totalCompras)} />
              <SummaryCard title="Cartões cadastrados" value={String(cards.length)} />
            </section>

            <section style={styles.grid2}>
              <form style={styles.panel} onSubmit={salvarCartao}>
                <h2 style={styles.h2}>Novo cartão</h2>
                <input placeholder="Nome do cartão" style={styles.input} value={novoCartao.nome} onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value })} />
                <input placeholder="Limite" type="number" style={styles.input} value={novoCartao.limite} onChange={(e) => setNovoCartao({ ...novoCartao, limite: e.target.value })} />
                <div style={styles.grid2Mini}>
                  <input placeholder="Fechamento" type="number" style={styles.input} value={novoCartao.fechamento} onChange={(e) => setNovoCartao({ ...novoCartao, fechamento: e.target.value })} />
                  <input placeholder="Vencimento" type="number" style={styles.input} value={novoCartao.vencimento} onChange={(e) => setNovoCartao({ ...novoCartao, vencimento: e.target.value })} />
                </div>
                <button style={styles.button}>Salvar cartão</button>
              </form>

              <form style={styles.panel} onSubmit={salvarCompra}>
                <h2 style={styles.h2}>Nova compra</h2>
                <select style={styles.input} value={novaCompra.cartaoId} onChange={(e) => setNovaCompra({ ...novaCompra, cartaoId: e.target.value })}>
                  <option value="">Selecione o cartão</option>
                  {cards.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                <input placeholder="Descrição da compra" style={styles.input} value={novaCompra.descricao} onChange={(e) => setNovaCompra({ ...novaCompra, descricao: e.target.value })} />
                <div style={styles.grid2Mini}>
                  <input placeholder="Valor total" type="number" style={styles.input} value={novaCompra.valor} onChange={(e) => setNovaCompra({ ...novaCompra, valor: e.target.value })} />
                  <input placeholder="Parcelas" type="number" style={styles.input} value={novaCompra.parcelas} onChange={(e) => setNovaCompra({ ...novaCompra, parcelas: e.target.value })} />
                </div>
                <div style={styles.grid2Mini}>
                  <input type="date" style={styles.input} value={novaCompra.data} onChange={(e) => setNovaCompra({ ...novaCompra, data: e.target.value })} />
                  <input placeholder="Categoria" style={styles.input} value={novaCompra.categoria} onChange={(e) => setNovaCompra({ ...novaCompra, categoria: e.target.value })} />
                </div>
                <input placeholder="Observação" style={styles.input} value={novaCompra.observacao} onChange={(e) => setNovaCompra({ ...novaCompra, observacao: e.target.value })} />
                <button style={styles.button}>Adicionar compra</button>
              </form>
            </section>

            <section style={styles.grid2}>
              <div style={styles.panel}>
                <h2 style={styles.h2}>Resumo por cartão</h2>
                <div style={{ display: "grid", gap: 14 }}>
                  {cardsResumo.map((c) => (
                    <div key={c.id} style={styles.itemCard}>
                      <div style={styles.rowBetween}>
                        <strong style={{ fontSize: 22 }}>{c.nome}</strong>
                        <span style={styles.tag}>{c.compras.length} compra(s)</span>
                      </div>
                      <div style={styles.statsGrid}>
                        <MiniStat title="Fatura atual" value={money(c.faturaAtual)} />
                        <MiniStat title="Usado" value={money(c.usado)} />
                        <MiniStat title="Disponível" value={money(c.disponivel)} />
                        <MiniStat title="Limite" value={money(c.limite)} />
                      </div>
                      <div style={styles.meta}>Fecha dia {c.fechamento} • Vence dia {c.vencimento}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.panel}>
                <h2 style={styles.h2}>Antecipar parcelas</h2>
                <select style={styles.input} value={antecipar.compraId} onChange={(e) => setAntecipar({ ...antecipar, compraId: e.target.value })}>
                  <option value="">Selecione a compra</option>
                  {purchases.filter((p) => p.parcelas > 1 && parcelasRestantes(p) > 0).map((p) => (
                    <option key={p.id} value={p.id}>{p.descricao} • {cardName(cards, p.cartaoId)}</option>
                  ))}
                </select>
                <input placeholder="Quantidade de parcelas" type="number" style={styles.input} value={antecipar.quantidade} onChange={(e) => setAntecipar({ ...antecipar, quantidade: e.target.value })} />
                <button style={styles.button} onClick={() => antecipar.compraId && antecipar.quantidade && anteciparParcelas(antecipar.compraId, antecipar.quantidade)}>Antecipar</button>
              </div>
            </section>

            <section style={styles.panel}>
              <div style={styles.rowBetweenWrap}>
                <h2 style={styles.h2}>Compras e parcelamentos</h2>
                <div style={styles.filtersWrap}>
                  <select style={styles.inputSmall} value={filtro.cartaoId} onChange={(e) => setFiltro({ ...filtro, cartaoId: e.target.value })}>
                    <option value="">Todos os cartões</option>
                    {cards.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                  <input placeholder="Filtrar por descrição" style={styles.inputSmall} value={filtro.descricao} onChange={(e) => setFiltro({ ...filtro, descricao: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gap: 14 }}>
                {comprasFiltradas.map((p) => (
                  <div key={p.id} style={styles.purchaseCard}>
                    <div style={styles.rowBetweenWrap}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 22 }}>{p.descricao}</div>
                        <div style={styles.meta}>{cardName(cards, p.cartaoId)} • {p.categoria} • {p.data}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 22 }}>{money(p.valor)}</div>
                        <div style={styles.meta}>{statusCompra(p)}</div>
                      </div>
                    </div>
                    <div style={styles.statsGrid}>
                      <MiniStat title="Parcela atual" value={parcelaAtualTexto(p)} />
                      <MiniStat title="Valor por parcela" value={money(valorParcela(p))} />
                      <MiniStat title="Faltam" value={`${parcelasRestantes(p)} parcela(s)`} />
                      <MiniStat title="Antecipadas" value={`${p.antecipadas}`} />
                    </div>
                    {p.observacao ? <div style={styles.note}>{p.observacao}</div> : null}
                    <div style={styles.actions}>
                      {p.parcelas > 1 && parcelasRestantes(p) > 0 ? (
                        <button style={styles.buttonGhost} onClick={() => anteciparParcelas(p.id, 1)}>Antecipar 1 parcela</button>
                      ) : null}
                      <button style={styles.buttonDanger} onClick={() => excluirCompra(p.id)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section style={styles.hero}><h1 style={styles.title}>{nav.find((n) => n[0] === aba)?.[1]}</h1></section>
        )}

        <nav style={styles.bottomNav}>
          {nav.map(([id, label]) => (
            <button key={id} onClick={() => setAba(id)} style={{ ...styles.navBtn, ...(aba === id ? styles.navBtnActive : {}) }}>{label}</button>
          ))}
        </nav>
      </div>
    </main>
  );
}

function SummaryCard({ title, value, highlight = false }) {
  return (
    <div style={{ ...styles.summary, ...(highlight ? styles.summaryHighlight : {}) }}>
      <div style={styles.summaryTitle}>{title}</div>
      <div style={styles.summaryValue}>{value}</div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div style={styles.miniStat}>
      <div style={styles.miniTitle}>{title}</div>
      <div style={styles.miniValue}>{value}</div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #12255f 0%, #071033 40%, #030817 100%)",
    color: "#f5f7ff",
    padding: 20,
    fontFamily: "Inter, Arial, sans-serif",
  },
  wrap: { maxWidth: 1460, margin: "0 auto", display: "grid", gap: 18 },
  hero: { background: "rgba(13,25,70,.72)", border: "1px solid rgba(126,145,255,.2)", borderRadius: 28, padding: 22 },
  badge: { display: "inline-block", padding: "10px 16px", borderRadius: 999, background: "rgba(111,138,255,.18)", fontWeight: 700, marginBottom: 12 },
  title: { fontSize: 52, lineHeight: 1, margin: 0 },
  subtitle: { color: "#aeb8da", fontSize: 18, marginTop: 12, marginBottom: 0 },
  monthRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" },
  label: { marginBottom: 8, color: "#b9c2e6", fontWeight: 700 },
  select: { background: "#071033", color: "#fff", border: "1px solid #304178", borderRadius: 12, padding: "12px 14px", minWidth: 220 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 16 },
  grid2Mini: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  summary: { background: "rgba(9,19,58,.9)", border: "1px solid rgba(115,132,226,.24)", borderRadius: 24, padding: 22 },
  summaryHighlight: { background: "linear-gradient(135deg, rgba(104,98,255,.35), rgba(65,30,120,.22))" },
  summaryTitle: { color: "#c1c9ea", fontSize: 18, marginBottom: 12 },
  summaryValue: { fontSize: 36, fontWeight: 800 },
  panel: { background: "rgba(6,15,51,.92)", border: "1px solid rgba(108,127,219,.22)", borderRadius: 28, padding: 22, display: "grid", gap: 12 },
  h2: { fontSize: 28, margin: 0, marginBottom: 6 },
  input: { width: "100%", background: "#061030", color: "#fff", border: "1px solid #22356e", borderRadius: 14, padding: "14px 16px", boxSizing: "border-box" },
  inputSmall: { background: "#061030", color: "#fff", border: "1px solid #22356e", borderRadius: 14, padding: "14px 16px", minWidth: 220 },
  button: { background: "linear-gradient(90deg, #7a8bff, #8a5cff)", color: "#fff", border: 0, borderRadius: 16, padding: "14px 18px", fontWeight: 800, cursor: "pointer" },
  itemCard: { background: "rgba(9,19,58,.75)", border: "1px solid rgba(115,132,226,.22)", borderRadius: 22, padding: 16 },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  rowBetweenWrap: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginTop: 14 },
  miniStat: { background: "rgba(19,31,79,.65)", borderRadius: 16, padding: 12, border: "1px solid rgba(115,132,226,.16)" },
  miniTitle: { fontSize: 13, color: "#aab5da", marginBottom: 6 },
  miniValue: { fontSize: 20, fontWeight: 800 },
  meta: { color: "#aab5da", marginTop: 8 },
  tag: { background: "rgba(111,138,255,.18)", color: "#dfe4ff", padding: "6px 12px", borderRadius: 999, fontSize: 13 },
  filtersWrap: { display: "flex", gap: 12, flexWrap: "wrap" },
  purchaseCard: { background: "rgba(9,19,58,.76)", border: "1px solid rgba(115,132,226,.22)", borderRadius: 22, padding: 16 },
  note: { marginTop: 10, padding: 12, borderRadius: 14, background: "rgba(122,139,255,.08)", color: "#d9e1ff" },
  actions: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  buttonGhost: { background: "rgba(122,139,255,.18)", color: "#fff", border: "1px solid rgba(122,139,255,.28)", borderRadius: 14, padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
  buttonDanger: { background: "rgba(180,55,84,.18)", color: "#ffd9e1", border: "1px solid rgba(180,55,84,.28)", borderRadius: 14, padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
  bottomNav: { position: "sticky", bottom: 12, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, background: "rgba(4,10,35,.94)", border: "1px solid rgba(116,134,229,.2)", borderRadius: 26, padding: 12 },
  navBtn: { background: "transparent", color: "#fff", border: 0, borderRadius: 18, padding: "16px 12px", fontSize: 18, fontWeight: 700, cursor: "pointer" },
  navBtnActive: { background: "rgba(112,103,255,.24)" },
  toast: { position: "sticky", top: 10, zIndex: 10, justifySelf: "center", background: "#0f1a4f", border: "1px solid #4f63c8", padding: "12px 18px", borderRadius: 14 },
};

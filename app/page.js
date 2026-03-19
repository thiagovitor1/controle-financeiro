"use client";

import { useMemo, useState } from "react";

function moeda(v) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

const meses = [
  "Janeiro 2026",
  "Fevereiro 2026",
  "Março 2026",
  "Abril 2026",
  "Maio 2026",
  "Junho 2026",
  "Julho 2026",
  "Agosto 2026",
  "Setembro 2026",
  "Outubro 2026",
  "Novembro 2026",
  "Dezembro 2026",
];

const dadosBase = {
  "Março 2026": {
    entradas: 6894.07,
    saidas: 7104.04,
    saldoContas: 115.13,
    cards: {
      fixas: { valor: 2430.22, itens: 7 },
      dividas: { valor: 1984.55, itens: 4 },
      cartoes: { valor: 1587.1, itens: 3 },
      variaveis: { valor: 1102.17, itens: 12 },
      receitas: { valor: 6894.07, itens: 5 },
    },
  },
};

const cartoesIniciais = [
  {
    id: 1,
    nome: "Nubank",
    limite: 8800,
    usado: 3280,
    fechamento: 25,
    vencimento: 1,
    compras: [
      { id: 11, descricao: "Notebook Dell", data: "12/03/2026", total: 2400, parcelas: "8 de 12", categoria: "Tecnologia" },
      { id: 12, descricao: "Mercado", data: "18/03/2026", total: 480, parcelas: "à vista", categoria: "Alimentação" },
      { id: 13, descricao: "Passagem", data: "20/03/2026", total: 400, parcelas: "2 de 4", categoria: "Transporte" },
    ],
  },
  {
    id: 2,
    nome: "Itaú Azul",
    limite: 3500,
    usado: 920,
    fechamento: 5,
    vencimento: 12,
    compras: [
      { id: 21, descricao: "Farmácia", data: "08/03/2026", total: 220, parcelas: "à vista", categoria: "Saúde" },
      { id: 22, descricao: "Curso online", data: "14/03/2026", total: 700, parcelas: "3 de 6", categoria: "Educação" },
    ],
  },
];

function getDados(mes) {
  return (
    dadosBase[mes] || {
      entradas: 0,
      saidas: 0,
      saldoContas: 0,
      cards: {
        fixas: { valor: 0, itens: 0 },
        dividas: { valor: 0, itens: 0 },
        cartoes: { valor: 0, itens: 0 },
        variaveis: { valor: 0, itens: 0 },
        receitas: { valor: 0, itens: 0 },
      },
    }
  );
}

function TopStat({ titulo, valor, destaque = false }) {
  return (
    <div className={`card stat ${destaque ? "highlight" : ""}`}>
      <div className="label">{titulo}</div>
      <div className="bigValue">{valor}</div>
    </div>
  );
}

function SummaryCard({ titulo, valor, itens }) {
  return (
    <div className="card summaryCard">
      <div className="summaryTitle">{titulo}</div>
      <div className="summaryValue">{valor}</div>
      <div className="muted small">{itens} item(ns)</div>
    </div>
  );
}

function HomeTab({ mes, setMes }) {
  const dados = useMemo(() => getDados(mes), [mes]);
  const saldoMes = dados.entradas - dados.saidas;

  return (
    <>
      <section className="hero card">
        <div>
          <div className="pill">Controle Financeiro • V3.7.3</div>
          <h1>Olá, Thiago</h1>
          <p className="muted">Agora com visual ajustado para iPhone e mobile-first.</p>
        </div>
        <button className="ghostButton">Sair</button>
      </section>

      <section className="toolbar">
        <div>
          <div className="small muted" style={{ marginBottom: 8 }}>Mês principal</div>
          <select className="input" value={mes} onChange={(e) => setMes(e.target.value)}>
            {meses.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </section>

      <section className="statsGrid">
        <TopStat titulo="Saldo do mês" valor={moeda(saldoMes)} destaque />
        <TopStat titulo="Entradas" valor={moeda(dados.entradas)} />
        <TopStat titulo="Saídas" valor={moeda(dados.saidas)} />
        <TopStat titulo="Saldo em contas" valor={moeda(dados.saldoContas)} />
      </section>

      <section className="summaryGrid">
        <SummaryCard titulo="Contas Fixas" valor={moeda(dados.cards.fixas.valor)} itens={dados.cards.fixas.itens} />
        <SummaryCard titulo="Dívidas" valor={moeda(dados.cards.dividas.valor)} itens={dados.cards.dividas.itens} />
        <SummaryCard titulo="Cartões" valor={moeda(dados.cards.cartoes.valor)} itens={dados.cards.cartoes.itens} />
        <SummaryCard titulo="Gastos Variáveis" valor={moeda(dados.cards.variaveis.valor)} itens={dados.cards.variaveis.itens} />
        <SummaryCard titulo="Receitas" valor={moeda(dados.cards.receitas.valor)} itens={dados.cards.receitas.itens} />
      </section>
    </>
  );
}

function CartaoItem({ cartao, ativo, onClick }) {
  const disponivel = cartao.limite - cartao.usado;
  return (
    <button onClick={onClick} className={`card cardButton ${ativo ? "activeCard" : ""}`}>
      <div className="cardItemTitle">{cartao.nome}</div>
      <div className="small">Fatura: {moeda(cartao.usado)}</div>
      <div className="small muted" style={{ marginTop: 4 }}>
        Disponível: {moeda(disponivel)} • Fecha {cartao.fechamento} • Vence {cartao.vencimento}
      </div>
    </button>
  );
}

function PurchaseRow({ compra }) {
  return (
    <div className="purchaseCard">
      <div>
        <div className="purchaseTitle">{compra.descricao}</div>
        <div className="small muted">{compra.data} • {compra.categoria}</div>
      </div>
      <div className="purchaseMeta">
        <div className="purchaseValue">{moeda(compra.total)}</div>
        <div className="small muted">{compra.parcelas}</div>
      </div>
      <button className="miniButton">Antecipar</button>
    </div>
  );
}

function CartoesTab() {
  const [cartoes, setCartoes] = useState(cartoesIniciais);
  const [cartaoAtivoId, setCartaoAtivoId] = useState(cartoesIniciais[0].id);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const cartaoAtivo = cartoes.find((c) => c.id === cartaoAtivoId) || cartoes[0];
  const [limiteEdit, setLimiteEdit] = useState(cartaoAtivo.limite);
  const [fechamentoEdit, setFechamentoEdit] = useState(cartaoAtivo.fechamento);
  const [vencimentoEdit, setVencimentoEdit] = useState(cartaoAtivo.vencimento);

  const totalLimite = cartoes.reduce((s, c) => s + c.limite, 0);
  const totalUsado = cartoes.reduce((s, c) => s + c.usado, 0);
  const totalDisponivel = totalLimite - totalUsado;

  const comprasFiltradas = cartaoAtivo.compras.filter((compra) =>
    compra.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  function selecionarCartao(cartao) {
    setCartaoAtivoId(cartao.id);
    setEditando(false);
    setMensagem("");
    setLimiteEdit(cartao.limite);
    setFechamentoEdit(cartao.fechamento);
    setVencimentoEdit(cartao.vencimento);
  }

  function iniciarEdicao() {
    setLimiteEdit(cartaoAtivo.limite);
    setFechamentoEdit(cartaoAtivo.fechamento);
    setVencimentoEdit(cartaoAtivo.vencimento);
    setEditando(true);
    setMensagem("");
  }

  function salvarEdicao() {
    setCartoes((prev) =>
      prev.map((c) =>
        c.id === cartaoAtivo.id
          ? {
              ...c,
              limite: Number(limiteEdit || 0),
              fechamento: Number(fechamentoEdit || 0),
              vencimento: Number(vencimentoEdit || 0),
            }
          : c
      )
    );
    setEditando(false);
    setMensagem("Cartão atualizado com sucesso.");
  }

  const ativoAtualizado = cartoes.find((c) => c.id === cartaoAtivoId) || cartaoAtivo;

  return (
    <>
      <section className="statsGrid">
        <TopStat titulo="Fatura do mês" valor={moeda(totalUsado)} />
        <TopStat titulo="Limite total" valor={moeda(totalLimite)} />
        <TopStat titulo="Disponível" valor={moeda(totalDisponivel)} destaque />
      </section>

      <section className="actionRow">
        <button className="primaryButton">Novo cartão</button>
        <button className="secondaryButton">Nova compra</button>
      </section>

      <section className="cardsLayout">
        <aside className="card listCard">
          <div className="sectionTitle">Meus cartões</div>
          <div className="stack">
            {cartoes.map((cartao) => (
              <CartaoItem
                key={cartao.id}
                cartao={cartao}
                ativo={ativoAtualizado.id === cartao.id}
                onClick={() => selecionarCartao(cartao)}
              />
            ))}
          </div>
        </aside>

        <section className="card detailCard">
          <div className="detailHeader">
            <div>
              <h2>{ativoAtualizado.nome}</h2>
              <div className="muted">Fecha dia {ativoAtualizado.fechamento} • Vence dia {ativoAtualizado.vencimento}</div>
            </div>
            <div className="detailInvoice">
              <div className="small muted">Fatura atual</div>
              <div className="detailValue">{moeda(ativoAtualizado.usado)}</div>
            </div>
          </div>

          <div className="editActions">
            {!editando ? (
              <button className="secondaryButton smallButton" onClick={iniciarEdicao}>Editar cartão</button>
            ) : (
              <>
                <button className="primaryButton smallButton" onClick={salvarEdicao}>Salvar</button>
                <button className="secondaryButton smallButton" onClick={() => setEditando(false)}>Cancelar</button>
              </>
            )}
          </div>

          {mensagem && <div className="messageBox">{mensagem}</div>}

          <div className="miniStats">
            <div className="card miniStat">
              <div className="small muted">Limite total</div>
              {!editando ? (
                <div className="miniStatValue">{moeda(ativoAtualizado.limite)}</div>
              ) : (
                <input className="input compact" value={limiteEdit} onChange={(e) => setLimiteEdit(e.target.value)} />
              )}
            </div>
            <div className="card miniStat">
              <div className="small muted">Fechamento</div>
              {!editando ? (
                <div className="miniStatValue">{ativoAtualizado.fechamento}</div>
              ) : (
                <input className="input compact" value={fechamentoEdit} onChange={(e) => setFechamentoEdit(e.target.value)} />
              )}
            </div>
            <div className="card miniStat">
              <div className="small muted">Vencimento</div>
              {!editando ? (
                <div className="miniStatValue">{ativoAtualizado.vencimento}</div>
              ) : (
                <input className="input compact" value={vencimentoEdit} onChange={(e) => setVencimentoEdit(e.target.value)} />
              )}
            </div>
          </div>

          <div className="purchaseHeader">
            <div className="sectionTitle" style={{ marginBottom: 0 }}>Compras</div>
            <input
              className="input compact searchInput"
              placeholder="Buscar compra"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="stack">
            {comprasFiltradas.map((compra) => (
              <PurchaseRow key={compra.id} compra={compra} />
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

function PlaceholderSection({ titulo, subtitulo }) {
  return (
    <section className="card" style={{ marginTop: 16 }}>
      <h2 style={{ marginTop: 0 }}>{titulo}</h2>
      <p className="muted" style={{ marginBottom: 0 }}>{subtitulo}</p>
    </section>
  );
}

export default function Page() {
  const [mes, setMes] = useState("Março 2026");
  const [tab, setTab] = useState("cartoes");

  return (
    <main className="pageRoot">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          background: radial-gradient(circle at top, #18285d 0%, #09122e 38%, #050a19 100%);
          color: #f2f5ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }
        .pageRoot {
          min-height: 100vh;
          padding: 18px 14px 28px;
        }
        .container {
          max-width: 1180px;
          margin: 0 auto;
        }
        .card {
          background: rgba(12, 19, 44, 0.72);
          border: 1px solid rgba(120, 146, 255, 0.14);
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.16);
          min-width: 0;
        }
        .hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          border-radius: 24px;
        }
        .pill {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(91, 126, 255, 0.18);
          color: #dce5ff;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 10px;
        }
        h1, h2 {
          margin: 0;
          letter-spacing: -0.03em;
        }
        h1 { font-size: 28px; font-weight: 800; }
        h2 { font-size: 24px; font-weight: 800; }
        .muted { color: rgba(212,220,255,0.72); }
        .small { font-size: 14px; }
        .input {
          width: 100%;
          background: rgba(9, 14, 33, 0.92);
          color: #f3f6ff;
          border: 1px solid rgba(122,146,255,0.18);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          outline: none;
        }
        .compact { padding: 10px 12px; }
        .toolbar {
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 16px;
          flex-wrap: wrap;
        }
        .statsGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .stat.highlight {
          background: rgba(124, 92, 255, 0.16);
          border-color: rgba(124, 92, 255, 0.35);
        }
        .label {
          color: rgba(222,228,255,0.78);
          font-size: 14px;
          margin-bottom: 8px;
        }
        .bigValue {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .summaryGrid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }
        .summaryCard {
          min-height: 110px;
          padding: 14px;
        }
        .summaryTitle {
          color: rgba(226,231,255,0.86);
          font-size: 15px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .summaryValue {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .ghostButton, .secondaryButton, .miniButton {
          background: rgba(255,255,255,0.04);
          color: #f5f7ff;
          border: 1px solid rgba(128,150,255,0.16);
          border-radius: 14px;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }
        .primaryButton {
          background: linear-gradient(90deg, #6d7cff 0%, #8862ff 100%);
          color: #f5f7ff;
          border: none;
          border-radius: 14px;
          padding: 12px 16px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
        }
        .smallButton {
          padding: 10px 14px;
          font-size: 14px;
        }
        .actionRow {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cardsLayout {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
        }
        .listCard, .detailCard {
          min-width: 0;
        }
        .stack {
          display: grid;
          gap: 10px;
        }
        .cardButton {
          text-align: left;
          width: 100%;
          cursor: pointer;
          min-width: 0;
        }
        .activeCard {
          border-color: rgba(124, 92, 255, 0.35);
          background: rgba(124, 92, 255, 0.12);
          box-shadow: 0 0 0 1px rgba(124, 92, 255, 0.16), 0 12px 26px rgba(48, 32, 120, 0.22);
        }
        .cardItemTitle {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 6px;
        }
        .detailHeader {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 14px;
          flex-wrap: wrap;
        }
        .detailInvoice {
          text-align: right;
        }
        .detailValue {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .editActions {
          margin-top: 14px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .messageBox {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(124, 92, 255, 0.14);
          border: 1px solid rgba(124, 92, 255, 0.24);
          color: #e7ddff;
          font-size: 14px;
          font-weight: 600;
        }
        .miniStats {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .miniStat {
          min-height: 86px;
        }
        .miniStatValue {
          font-size: 24px;
          font-weight: 800;
          margin-top: 8px;
          line-height: 1.1;
        }
        .purchaseHeader {
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sectionTitle {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .searchInput {
          width: 220px;
        }
        .purchaseCard {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: 12px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(120,146,255,0.10);
        }
        .purchaseTitle {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .purchaseMeta {
          text-align: right;
          white-space: nowrap;
        }
        .purchaseValue {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .miniButton {
          padding: 10px 12px;
          font-size: 14px;
          white-space: nowrap;
        }
        .bottomNav {
          position: sticky;
          bottom: 16px;
          margin-top: 24px;
          background: rgba(8, 14, 34, 0.92);
          border: 1px solid rgba(122, 147, 255, 0.16);
          border-radius: 24px;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 34px rgba(0,0,0,0.28);
        }
        .navItem {
          text-align: center;
          color: rgba(231,236,255,0.9);
          font-weight: 700;
          font-size: 16px;
          padding: 12px 8px;
          border-radius: 16px;
          cursor: pointer;
          user-select: none;
        }
        .navItem.active {
          background: rgba(124, 92, 255, 0.16);
        }

        @media (max-width: 900px) {
          .statsGrid {
            grid-template-columns: 1fr;
          }
          .summaryGrid {
            grid-template-columns: 1fr 1fr;
          }
          .cardsLayout {
            grid-template-columns: 1fr;
          }
          .detailInvoice {
            text-align: left;
          }
          .miniStats {
            grid-template-columns: 1fr;
          }
          .searchInput {
            width: 100%;
          }
          .purchaseCard {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 14px 0 16px;
          }
          .purchaseMeta {
            text-align: left;
          }
          .actionRow > button {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .pageRoot {
            padding: 12px 12px 24px;
          }
          h1 {
            font-size: 22px;
          }
          h2 {
            font-size: 18px;
          }
          .hero {
            padding: 14px;
            border-radius: 20px;
          }
          .card {
            padding: 14px;
            border-radius: 18px;
          }
          .bigValue {
            font-size: 20px;
          }
          .summaryValue {
            font-size: 18px;
          }
          .cardItemTitle {
            font-size: 16px;
          }
          .detailValue {
            font-size: 24px;
          }
          .sectionTitle {
            font-size: 18px;
          }
          .summaryGrid {
            grid-template-columns: 1fr;
          }
          .bottomNav {
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
            padding: 8px;
            border-radius: 20px;
          }
          .navItem {
            font-size: 12px;
            padding: 10px 4px;
          }
        }
      `}</style>

      <div className="container">
        {tab === "inicio" && <HomeTab mes={mes} setMes={setMes} />}
        {tab === "contas" && <PlaceholderSection titulo="Contas" subtitulo="Aqui entra a listagem e edição das contas bancárias." />}
        {tab === "lancar" && <PlaceholderSection titulo="Lançar" subtitulo="Aqui entra o formulário de receitas, despesas e pagamentos." />}
        {tab === "cartoes" && <CartoesTab />}
        {tab === "mais" && <PlaceholderSection titulo="Mais" subtitulo="Aqui entram categorias, filtros avançados e outras opções." />}

        <div className="bottomNav">
          <div className={`navItem ${tab === "inicio" ? "active" : ""}`} onClick={() => setTab("inicio")}>Início</div>
          <div className={`navItem ${tab === "contas" ? "active" : ""}`} onClick={() => setTab("contas")}>Contas</div>
          <div className={`navItem ${tab === "lancar" ? "active" : ""}`} onClick={() => setTab("lancar")}>Lançar</div>
          <div className={`navItem ${tab === "cartoes" ? "active" : ""}`} onClick={() => setTab("cartoes")}>Cartões</div>
          <div className={`navItem ${tab === "mais" ? "active" : ""}`} onClick={() => setTab("mais")}>Mais</div>
        </div>
      </div>
    </main>
  );
}

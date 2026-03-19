"use client";

import { useState } from "react";

function moeda(v) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

const cartoes = [
  {
    id: 1,
    nome: "Nubank",
    limite: 8800,
    usado: 3280,
    fechamento: 25,
    vencimento: 1,
    compras: [
      { id: 1, descricao: "Notebook Dell", categoria: "Tecnologia", data: "12/03/2026", valor: 2400, parcelas: "8 de 12" },
      { id: 2, descricao: "Mercado", categoria: "Alimentação", data: "18/03/2026", valor: 480, parcelas: "à vista" },
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
      { id: 3, descricao: "Farmácia", categoria: "Saúde", data: "08/03/2026", valor: 220, parcelas: "à vista" },
    ],
  },
];

function IconAction({ children }) {
  return <button className="iconAction">{children}</button>;
}

function CompraItem({ compra }) {
  return (
    <div className="purchaseCard">
      <div className="purchaseTitle">{compra.descricao}</div>
      <div className="purchaseSub">{compra.data} • {compra.categoria}</div>
      <div className="purchaseBottom">
        <div>
          <div className="purchaseValue">{moeda(compra.valor)}</div>
          <div className="purchaseSub">{compra.parcelas}</div>
        </div>
        <button className="miniBtn">Antecipar</button>
      </div>
    </div>
  );
}

export default function Page() {
  const [selecionado, setSelecionado] = useState(cartoes[0].id);
  const [busca, setBusca] = useState("");

  const cartao = cartoes.find((c) => c.id === Number(selecionado)) || cartoes[0];
  const compras = cartao.compras.filter((c) =>
    c.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="pageRoot">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          background:
            radial-gradient(circle at top, #1a2a63 0%, #0b1537 38%, #060b1d 100%);
          color: #f5f7ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }
        .pageRoot {
          min-height: 100vh;
          padding: 12px;
        }
        .container {
          max-width: 720px;
          margin: 0 auto;
          display: grid;
          gap: 14px;
        }
        .topBar {
          background: rgba(10, 16, 38, 0.72);
          border: 1px solid rgba(136, 154, 255, 0.10);
          border-radius: 18px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245, 247, 255, 0.92);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.02em;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
          backdrop-filter: blur(10px);
        }
        .card {
          background: linear-gradient(180deg, rgba(11,18,48,0.94) 0%, rgba(8,14,38,0.94) 100%);
          border: 1px solid rgba(124, 143, 255, 0.12);
          border-radius: 24px;
          padding: 16px;
          min-width: 0;
          box-shadow:
            0 12px 30px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.02);
        }
        .rowBetween {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .title {
          font-size: 15px;
          font-weight: 700;
          color: rgba(245,247,255,0.96);
        }
        .muted {
          color: rgba(215, 222, 255, 0.66);
          font-size: 12px;
        }
        .iconAction {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 12px;
          border: 1px solid rgba(128, 145, 255, 0.16);
          background: linear-gradient(180deg, rgba(98, 95, 255, 0.22) 0%, rgba(98, 95, 255, 0.14) 100%);
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px rgba(56, 41, 145, 0.18);
        }
        .select {
          width: 100%;
          margin-top: 10px;
          background: rgba(3, 8, 28, 0.94);
          color: #fff;
          border: 1px solid rgba(121,140,248,.14);
          border-radius: 18px;
          padding: 14px 14px;
          font-size: 15px;
          outline: none;
        }
        .heroHead {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 12px;
        }
        .heroName {
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
          margin: 0 0 8px 0;
          letter-spacing: -0.04em;
        }
        .heroInvoice {
          margin-top: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(126, 145, 255, 0.08);
          border-radius: 18px;
          padding: 12px 14px;
        }
        .invoiceLabel {
          font-size: 11px;
          color: rgba(213, 221, 255, 0.62);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .invoiceValue {
          font-size: 20px;
          font-weight: 800;
          line-height: 1.1;
        }
        .stats {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }
        .statBox {
          background: rgba(6, 11, 32, 0.88);
          border: 1px solid rgba(124, 143, 255, 0.10);
          border-radius: 18px;
          padding: 12px 14px;
        }
        .statLabel {
          font-size: 11px;
          color: rgba(213, 221, 255, 0.62);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .statValue {
          font-size: 17px;
          font-weight: 800;
          line-height: 1.1;
          word-break: break-word;
        }
        .input {
          width: 100%;
          background: rgba(3, 8, 28, 0.94);
          color: #fff;
          border: 1px solid rgba(121,140,248,.14);
          border-radius: 16px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }
        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .purchaseList {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }
        .purchaseCard {
          background: rgba(6, 11, 32, 0.88);
          border: 1px solid rgba(124, 143, 255, 0.10);
          border-radius: 18px;
          padding: 12px;
        }
        .purchaseTitle {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .purchaseSub {
          font-size: 12px;
          color: rgba(213, 221, 255, 0.64);
          line-height: 1.4;
        }
        .purchaseBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .purchaseValue {
          font-size: 16px;
          font-weight: 800;
        }
        .miniBtn {
          background: rgba(255,255,255,0.03);
          color: #fff;
          border: 1px solid rgba(124, 143, 255, 0.12);
          border-radius: 12px;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 700;
        }
        .bottomNav {
          position: sticky;
          bottom: 10px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          background: rgba(8, 14, 34, 0.95);
          border: 1px solid rgba(122, 147, 255, 0.14);
          border-radius: 20px;
          padding: 8px;
          margin-top: 8px;
          box-shadow: 0 16px 34px rgba(0,0,0,0.24);
          backdrop-filter: blur(12px);
        }
        .navItem {
          text-align: center;
          color: rgba(231,236,255,0.86);
          font-weight: 700;
          font-size: 12px;
          padding: 10px 4px;
          border-radius: 14px;
          background: transparent;
        }
        .navItem.active {
          background: rgba(124, 92, 255, 0.14);
        }
      `}</style>

      <div className="container">
        <div className="topBar">Cartão</div>

        <section className="card">
          <div className="rowBetween">
            <div className="title">Cartão selecionado</div>
            <IconAction>+</IconAction>
          </div>
          <select className="select" value={selecionado} onChange={(e) => setSelecionado(e.target.value)}>
            {cartoes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </section>

        <section className="card">
          <div className="heroHead">
            <div>
              <h1 className="heroName">{cartao.nome}</h1>
              <div className="muted">Fecha dia {cartao.fechamento} • Vence dia {cartao.vencimento}</div>
            </div>
            <IconAction>✎</IconAction>
          </div>

          <div className="heroInvoice">
            <div className="invoiceLabel">Fatura atual</div>
            <div className="invoiceValue">{moeda(cartao.usado)}</div>
          </div>

          <div className="stats">
            <div className="statBox">
              <div className="statLabel">Limite total</div>
              <div className="statValue">{moeda(cartao.limite)}</div>
            </div>
            <div className="statBox">
              <div className="statLabel">Fechamento</div>
              <div className="statValue">{cartao.fechamento}</div>
            </div>
            <div className="statBox">
              <div className="statLabel">Vencimento</div>
              <div className="statValue">{cartao.vencimento}</div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="sectionHeader">
            <div className="title">Compras</div>
            <IconAction>+</IconAction>
          </div>

          <input
            className="input"
            placeholder="Buscar compra"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="purchaseList">
            {compras.map((compra) => (
              <CompraItem key={compra.id} compra={compra} />
            ))}
          </div>
        </section>

        <div className="bottomNav">
          <div className="navItem">Início</div>
          <div className="navItem">Contas</div>
          <div className="navItem">Lançar</div>
          <div className="navItem active">Cartões</div>
          <div className="navItem">Mais</div>
        </div>
      </div>
    </main>
  );
}

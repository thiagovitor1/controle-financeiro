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
      { id: 3, descricao: "Passagem", categoria: "Transporte", data: "20/03/2026", valor: 400, parcelas: "2 de 4" },
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
      { id: 4, descricao: "Farmácia", categoria: "Saúde", data: "08/03/2026", valor: 220, parcelas: "à vista" },
      { id: 5, descricao: "Curso online", categoria: "Educação", data: "14/03/2026", valor: 700, parcelas: "3 de 6" },
    ],
  },
];

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
          background: radial-gradient(circle at top, #18285d 0%, #09122e 38%, #050a19 100%);
          color: #f2f5ff;
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
        .card {
          background: rgba(10, 17, 48, 0.9);
          border: 1px solid rgba(119, 139, 255, 0.16);
          border-radius: 22px;
          padding: 14px;
          min-width: 0;
        }
        .rowBetween {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .muted {
          color: rgba(213, 221, 255, 0.68);
          font-size: 12px;
        }
        .iconBtn {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          border: 1px solid rgba(119, 139, 255, 0.2);
          background: rgba(111, 104, 255, 0.18);
          color: #fff;
          font-size: 24px;
          font-weight: 700;
        }
        .select {
          width: 100%;
          margin-top: 10px;
          background: #020a29;
          color: #fff;
          border: 1px solid rgba(119, 139, 255, 0.16);
          border-radius: 16px;
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
          font-size: 28px;
          font-weight: 800;
          line-height: 1;
          margin: 0 0 6px 0;
          letter-spacing: -0.03em;
        }
        .heroInvoice {
          text-align: right;
        }
        .invoiceLabel {
          font-size: 12px;
          color: rgba(213, 221, 255, 0.68);
          margin-bottom: 4px;
        }
        .invoiceValue {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.1;
        }
        .editRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
        }
        .pillStats {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }
        .statBox {
          background: rgba(7, 12, 34, 0.82);
          border: 1px solid rgba(119, 139, 255, 0.14);
          border-radius: 18px;
          padding: 12px 14px;
        }
        .statLabel {
          font-size: 11px;
          color: rgba(213, 221, 255, 0.68);
          margin-bottom: 6px;
        }
        .statValue {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.1;
          word-break: break-word;
        }
        .input {
          width: 100%;
          background: #020a29;
          color: #fff;
          border: 1px solid rgba(119, 139, 255, 0.16);
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }
        .purchaseHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .purchaseList {
          display: grid;
          gap: 10px;
        }
        .purchaseCard {
          background: rgba(7, 12, 34, 0.82);
          border: 1px solid rgba(119, 139, 255, 0.12);
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
          color: rgba(213, 221, 255, 0.68);
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
          background: rgba(255,255,255,0.04);
          color: #fff;
          border: 1px solid rgba(119, 139, 255, 0.16);
          border-radius: 12px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 700;
        }
        .bottomNav {
          position: sticky;
          bottom: 10px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          background: rgba(8, 14, 34, 0.95);
          border: 1px solid rgba(122, 147, 255, 0.16);
          border-radius: 20px;
          padding: 8px;
          margin-top: 8px;
        }
        .navItem {
          text-align: center;
          color: rgba(231,236,255,0.9);
          font-weight: 700;
          font-size: 12px;
          padding: 10px 4px;
          border-radius: 14px;
          background: transparent;
        }
        .navItem.active {
          background: rgba(124, 92, 255, 0.16);
        }
      `}</style>

      <div className="container">
        <section className="card">
          <div className="rowBetween">
            <div className="title">Cartão selecionado</div>
            <button className="iconBtn">＋</button>
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
            <button className="iconBtn">✎</button>
          </div>

          <div className="heroInvoice" style={{ marginTop: 14, textAlign: "left" }}>
            <div className="invoiceLabel">Fatura atual</div>
            <div className="invoiceValue">{moeda(cartao.usado)}</div>
          </div>

          <div className="pillStats">
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
          <div className="purchaseHeader">
            <div className="title">Compras</div>
            <button className="iconBtn">＋</button>
          </div>

          <input
            className="input"
            placeholder="Buscar compra"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="purchaseList" style={{ marginTop: 12 }}>
            {compras.map((compra) => (
              <div key={compra.id} className="purchaseCard">
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

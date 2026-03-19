"use client";

import { useMemo, useState } from "react";

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
    faturas: ["Janeiro/2026", "Fevereiro/2026", "Março/2026", "Abril/2026"],
    compras: [
      { id: 1, descricao: "Notebook Dell", categoria: "Tecnologia", data: "12/03/2026", valor: 2400, parcelas: "8 de 12", fatura: "Abril/2026" },
      { id: 2, descricao: "Mercado", categoria: "Alimentação", data: "18/03/2026", valor: 480, parcelas: "à vista", fatura: "Abril/2026" },
      { id: 3, descricao: "Passagem", categoria: "Transporte", data: "20/02/2026", valor: 400, parcelas: "2 de 4", fatura: "Março/2026" },
      { id: 4, descricao: "Farmácia", categoria: "Saúde", data: "22/01/2026", valor: 160, parcelas: "à vista", fatura: "Fevereiro/2026" },
    ],
  },
  {
    id: 2,
    nome: "Itaú Azul",
    limite: 3500,
    usado: 920,
    fechamento: 5,
    vencimento: 12,
    faturas: ["Janeiro/2026", "Fevereiro/2026", "Março/2026"],
    compras: [
      { id: 5, descricao: "Curso online", categoria: "Educação", data: "14/03/2026", valor: 700, parcelas: "3 de 6", fatura: "Março/2026" },
      { id: 6, descricao: "Farmácia", categoria: "Saúde", data: "08/03/2026", valor: 220, parcelas: "à vista", fatura: "Março/2026" },
    ],
  },
];

function CompraItem({ compra }) {
  return (
    <div className="purchaseCard">
      <div>
        <div className="purchaseTitle">{compra.descricao}</div>
        <div className="purchaseSub">{compra.data} • {compra.categoria}</div>
      </div>
      <div className="purchaseFooter">
        <div>
          <div className="purchaseValue">{moeda(compra.valor)}</div>
          <div className="purchaseSub">{compra.parcelas}</div>
        </div>
        <button className="miniBtn">Antecipar</button>
      </div>
    </div>
  );
}

function IconBtn({ children }) {
  return <button className="iconBtn">{children}</button>;
}

export default function Page() {
  const [selecionado, setSelecionado] = useState(cartoes[0].id);
  const cartao = cartoes.find((c) => c.id === Number(selecionado)) || cartoes[0];
  const [mesFatura, setMesFatura] = useState(cartao.faturas[cartao.faturas.length - 1]);
  const [busca, setBusca] = useState("");

  const cartaoAtual = useMemo(
    () => cartoes.find((c) => c.id === Number(selecionado)) || cartoes[0],
    [selecionado]
  );

  const faturasDisponiveis = cartaoAtual.faturas || [];

  const compras = useMemo(() => {
    return cartaoAtual.compras.filter((c) =>
      c.fatura === mesFatura &&
      c.descricao.toLowerCase().includes(busca.toLowerCase())
    );
  }, [cartaoAtual, mesFatura, busca]);

  const totalFatura = compras.reduce((s, c) => s + Number(c.valor || 0), 0);

  function trocarCartao(id) {
    const novo = cartoes.find((c) => c.id === Number(id)) || cartoes[0];
    setSelecionado(novo.id);
    setMesFatura(novo.faturas[novo.faturas.length - 1]);
    setBusca("");
  }

  return (
    <main className="pageRoot">
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          background: radial-gradient(circle at top, #2a1458 0%, #170c36 38%, #0d0820 100%);
          color: #f7f5ff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }
        .pageRoot {
          min-height: 100vh;
          padding: 12px 12px 24px;
        }
        .container {
          max-width: 760px;
          margin: 0 auto;
          display: grid;
          gap: 14px;
        }
        .topBar {
          min-height: 40px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(245,240,255,0.9);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
        }
        .card {
          background: linear-gradient(180deg, rgba(31,17,66,0.92) 0%, rgba(21,12,46,0.96) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.03);
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
          color: rgba(248,245,255,0.96);
        }
        .muted {
          color: rgba(224,216,245,0.66);
          font-size: 12px;
        }
        .iconBtn {
          width: 32px;
          height: 32px;
          min-width: 32px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.06);
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0,0,0,0.14);
        }
        .select, .input {
          width: 100%;
          background: rgba(8, 5, 24, 0.9);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 13px 14px;
          font-size: 14px;
          outline: none;
        }
        .select { margin-top: 10px; }
        .heroHead {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 12px;
        }
        .heroName {
          margin: 0 0 6px 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .invoiceWrap {
          margin-top: 16px;
          padding: 14px;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .invoiceLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(224,216,245,0.6);
          margin-bottom: 4px;
        }
        .invoiceValue {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.1;
        }
        .stats {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }
        .statBox {
          border-radius: 18px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .statLabel {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: rgba(224,216,245,0.6);
          margin-bottom: 6px;
        }
        .statValue {
          font-size: 17px;
          font-weight: 800;
          line-height: 1.1;
        }
        .sectionHeader {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .faturaSelect {
          width: 132px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%);
          color: rgba(248,245,255,0.96);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 9px 30px 9px 12px;
          font-size: 12px;
          font-weight: 600;
          outline: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
          background-image:
            linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.8) 50%),
            linear-gradient(135deg, rgba(255,255,255,0.8) 50%, transparent 50%);
          background-position:
            calc(100% - 16px) calc(50% - 2px),
            calc(100% - 11px) calc(50% - 2px);
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }
        .purchaseList {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }
        .purchaseCard {
          border-radius: 18px;
          padding: 12px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .purchaseTitle {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .purchaseSub {
          font-size: 12px;
          color: rgba(224,216,245,0.64);
          line-height: 1.4;
        }
        .purchaseFooter {
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
          background: rgba(255,255,255,0.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 700;
        }
        .faturaResumo {
          margin-top: 10px;
          font-size: 12px;
          color: rgba(224,216,245,0.7);
        }
        .bottomNav {
          position: sticky;
          bottom: 10px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          padding: 8px;
          border-radius: 20px;
          background: rgba(12, 8, 28, 0.88);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          box-shadow: 0 16px 34px rgba(0,0,0,0.22);
        }
        .navItem {
          text-align: center;
          color: rgba(242,239,255,0.82);
          font-weight: 700;
          font-size: 12px;
          padding: 10px 4px;
          border-radius: 14px;
        }
        .navItem.active {
          background: rgba(130,92,255,0.18);
        }
      `}</style>

      <div className="container">
        <div className="topBar">Cartão</div>

        <section className="card">
          <div className="rowBetween">
            <div className="title">Cartão selecionado</div>
            <IconBtn>+</IconBtn>
          </div>
          <select className="select" value={selecionado} onChange={(e) => trocarCartao(e.target.value)}>
            {cartoes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </section>

        <section className="card">
          <div className="heroHead">
            <div>
              <h1 className="heroName">{cartaoAtual.nome}</h1>
              <div className="muted">Fecha dia {cartaoAtual.fechamento} • Vence dia {cartaoAtual.vencimento}</div>
            </div>
            <IconBtn>✎</IconBtn>
          </div>

          <div className="invoiceWrap">
            <div className="invoiceLabel">Fatura atual</div>
            <div className="invoiceValue">{moeda(cartaoAtual.usado)}</div>
          </div>

          <div className="stats">
            <div className="statBox">
              <div className="statLabel">Limite total</div>
              <div className="statValue">{moeda(cartaoAtual.limite)}</div>
            </div>
            <div className="statBox">
              <div className="statLabel">Fechamento</div>
              <div className="statValue">{cartaoAtual.fechamento}</div>
            </div>
            <div className="statBox">
              <div className="statLabel">Vencimento</div>
              <div className="statValue">{cartaoAtual.vencimento}</div>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="sectionHeader">
            <div className="title">Compras</div>
            <select className="faturaSelect" value={mesFatura} onChange={(e) => setMesFatura(e.target.value)}>
              {faturasDisponiveis.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <IconBtn>+</IconBtn>
          </div>

          <input
            className="input"
            placeholder="Buscar compra"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="faturaResumo">
            Fatura filtrada: <strong>{mesFatura}</strong> • Total: <strong>{moeda(totalFatura)}</strong>
          </div>

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

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
      cartoes: { valor: 1587.10, itens: 3 },
      variaveis: { valor: 1102.17, itens: 12 },
      receitas: { valor: 6894.07, itens: 5 },
    },
  },
};

const cartoesMock = [
  {
    id: 1,
    nome: "Nubank",
    limite: 5000,
    usado: 3280,
    fechamento: 10,
    vencimento: 17,
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

function shellStyle() {
  return {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #18285d 0%, #09122e 38%, #050a19 100%)",
    color: "#F2F5FF",
    padding: "20px 16px 28px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };
}

function cardBase(extra = {}) {
  return {
    background: "rgba(12, 19, 44, 0.72)",
    border: "1px solid rgba(120, 146, 255, 0.14)",
    borderRadius: 20,
    padding: "16px 16px 14px",
    boxShadow: "0 8px 22px rgba(0,0,0,0.16)",
    ...extra,
  };
}

function TopCard({ titulo, valor, destaque = false }) {
  return (
    <div
      style={cardBase({
        background: destaque ? "rgba(124, 92, 255, 0.16)" : "rgba(12, 19, 44, 0.78)",
        border: destaque ? "1px solid rgba(124, 92, 255, 0.35)" : "1px solid rgba(120, 146, 255, 0.14)",
        minHeight: 108,
      })}
    >
      <div style={{ color: "rgba(222,228,255,0.78)", fontSize: 15, marginBottom: 10 }}>
        {titulo}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>{valor}</div>
    </div>
  );
}

function ResumoCard({ titulo, valor, itens }) {
  return (
    <div style={cardBase({ minHeight: 118 })}>
      <div style={{ color: "rgba(226,231,255,0.86)", fontSize: 16, marginBottom: 10, fontWeight: 600 }}>
        {titulo}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>{valor}</div>
      <div style={{ marginTop: 10, color: "rgba(200,208,245,0.72)", fontSize: 14 }}>
        {itens} item(ns)
      </div>
    </div>
  );
}

function PlaceholderSection({ titulo, subtitulo }) {
  return (
    <section style={cardBase({ borderRadius: 24, marginTop: 16, padding: 20 })}>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{titulo}</div>
      <div style={{ color: "rgba(212,220,255,0.72)", fontSize: 15 }}>{subtitulo}</div>
    </section>
  );
}

function HomeTab({ mes, setMes }) {
  const dados = useMemo(() => getDados(mes), [mes]);
  const saldoMes = dados.entradas - dados.saidas;

  return (
    <>
      <section
        style={{
          background: "rgba(11, 19, 45, 0.72)",
          border: "1px solid rgba(120,146,255,0.15)",
          borderRadius: 28,
          padding: "18px 18px 16px",
          boxShadow: "0 16px 38px rgba(0,0,0,0.22)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(91, 126, 255, 0.18)",
              color: "#DCE5FF",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Controle Financeiro • V3.7
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Olá, Thiago
          </div>
          <div style={{ marginTop: 6, color: "rgba(212,220,255,0.72)", fontSize: 15 }}>
            Visual mais limpo e navegação mais simples.
          </div>
        </div>

        <button
          style={{
            background: "transparent",
            color: "rgba(232,236,255,0.85)",
            border: "1px solid rgba(130,148,255,0.18)",
            borderRadius: 16,
            padding: "12px 18px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </section>

      <section
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ color: "rgba(224,230,255,0.8)", fontSize: 15, marginBottom: 8 }}>
            Mês principal
          </div>
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            style={{
              background: "rgba(11, 19, 45, 0.82)",
              color: "#F3F6FF",
              border: "1px solid rgba(122,146,255,0.18)",
              borderRadius: 14,
              padding: "12px 14px",
              minWidth: 220,
              fontSize: 16,
              outline: "none",
            }}
          >
            {meses.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14,
        }}
      >
        <TopCard titulo="Saldo do mês" valor={moeda(saldoMes)} destaque />
        <TopCard titulo="Entradas" valor={moeda(dados.entradas)} />
        <TopCard titulo="Saídas" valor={moeda(dados.saidas)} />
        <TopCard titulo="Saldo em contas" valor={moeda(dados.saldoContas)} />
      </section>

      <section
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <ResumoCard titulo="Contas Fixas" valor={moeda(dados.cards.fixas.valor)} itens={dados.cards.fixas.itens} />
        <ResumoCard titulo="Dívidas" valor={moeda(dados.cards.dividas.valor)} itens={dados.cards.dividas.itens} />
        <ResumoCard titulo="Cartões" valor={moeda(dados.cards.cartoes.valor)} itens={dados.cards.cartoes.itens} />
        <ResumoCard titulo="Gastos Variáveis" valor={moeda(dados.cards.variaveis.valor)} itens={dados.cards.variaveis.itens} />
        <ResumoCard titulo="Receitas" valor={moeda(dados.cards.receitas.valor)} itens={dados.cards.receitas.itens} />
      </section>
    </>
  );
}

function ActionButton({ children, onClick, secondary = False }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: secondary ? "rgba(255,255,255,0.04)" : "linear-gradient(90deg, #6d7cff 0%, #8862ff 100%)",
        color: "#F5F7FF",
        border: secondary ? "1px solid rgba(128,150,255,0.16)" : "none",
        borderRadius: 16,
        padding: "14px 16px",
        fontWeight: 800,
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function MiniTopCard({ titulo, valor }) {
  return (
    <div style={cardBase({ minHeight: 100 })}>
      <div style={{ color: "rgba(215,223,255,0.72)", fontSize: 14, marginBottom: 8 }}>{titulo}</div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{valor}</div>
    </div>
  );
}

function CartaoItem({ cartao, ativo, onClick }) {
  const disponivel = cartao.limite - cartao.usado;
  return (
    <button
      onClick={onClick}
      style={{
        ...cardBase({
          textAlign: "left",
          borderColor: ativo ? "rgba(124, 92, 255, 0.35)" : "rgba(120, 146, 255, 0.14)",
          background: ativo ? "rgba(124, 92, 255, 0.12)" : "rgba(12, 19, 44, 0.72)",
          cursor: "pointer",
          width: "100%",
        }),
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{cartao.nome}</div>
      <div style={{ color: "rgba(220,228,255,0.82)", fontSize: 15 }}>Fatura atual: {moeda(cartao.usado)}</div>
      <div style={{ color: "rgba(200,208,245,0.72)", fontSize: 14, marginTop: 4 }}>
        Disponível: {moeda(disponivel)} • Fecha dia {cartao.fechamento} • Vence dia {cartao.vencimento}
      </div>
    </button>
  );
}

function CompraLinha({ compra }) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid rgba(120,146,255,0.10)",
        display: "grid",
        gridTemplateColumns: "1.2fr .7fr .5fr .6fr",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{compra.descricao}</div>
        <div style={{ color: "rgba(200,208,245,0.72)", fontSize: 14, marginTop: 4 }}>
          {compra.data} • {compra.categoria}
        </div>
      </div>
      <div style={{ fontWeight: 700 }}>{moeda(compra.total)}</div>
      <div style={{ color: "rgba(220,228,255,0.82)" }}>{compra.parcelas}</div>
      <button
        style={{
          background: "rgba(255,255,255,0.04)",
          color: "#F5F7FF",
          border: "1px solid rgba(128,150,255,0.16)",
          borderRadius: 12,
          padding: "10px 12px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Antecipar
      </button>
    </div>
  );
}

function CartoesTab() {
  const [cartaoAtivo, setCartaoAtivo] = useState(cartoesMock[0]);
  const totalLimite = cartoesMock.reduce((s, c) => s + c.limite, 0);
  const totalUsado = cartoesMock.reduce((s, c) => s + c.usado, 0);
  const totalDisponivel = totalLimite - totalUsado;

  return (
    <>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
        <MiniTopCard titulo="Fatura do mês" valor={moeda(totalUsado)} />
        <MiniTopCard titulo="Limite usado" valor={moeda(totalUsado)} />
        <MiniTopCard titulo="Limite disponível" valor={moeda(totalDisponivel)} />
      </section>

      <section style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button style={{
          background: "linear-gradient(90deg, #6d7cff 0%, #8862ff 100%)",
          color: "#F5F7FF",
          border: "none",
          borderRadius: 16,
          padding: "14px 18px",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
        }}>Novo cartão</button>
        <button style={{
          background: "rgba(255,255,255,0.04)",
          color: "#F5F7FF",
          border: "1px solid rgba(128,150,255,0.16)",
          borderRadius: 16,
          padding: "14px 18px",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
        }}>Nova compra</button>
      </section>

      <section style={{ marginTop: 18, display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <div style={cardBase({ padding: 14 })}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Meus cartões</div>
          <div style={{ display: "grid", gap: 12 }}>
            {cartoesMock.map((cartao) => (
              <CartaoItem
                key={cartao.id}
                cartao={cartao}
                ativo={cartaoAtivo.id === cartao.id}
                onClick={() => setCartaoAtivo(cartao)}
              />
            ))}
          </div>
        </div>

        <div style={cardBase({ padding: 18 })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{cartaoAtivo.nome}</div>
              <div style={{ color: "rgba(212,220,255,0.72)", fontSize: 15, marginTop: 6 }}>
                Fecha dia {cartaoAtivo.fechamento} • Vence dia {cartaoAtivo.vencimento}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "rgba(212,220,255,0.72)", fontSize: 14 }}>Fatura atual</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{moeda(cartaoAtivo.usado)}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div style={cardBase({ minHeight: 86 })}>
              <div style={{ color: "rgba(212,220,255,0.72)", fontSize: 14, marginBottom: 8 }}>Limite total</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{moeda(cartaoAtivo.limite)}</div>
            </div>
            <div style={cardBase({ minHeight: 86 })}>
              <div style={{ color: "rgba(212,220,255,0.72)", fontSize: 14, marginBottom: 8 }}>Usado</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{moeda(cartaoAtivo.usado)}</div>
            </div>
            <div style={cardBase({ minHeight: 86 })}>
              <div style={{ color: "rgba(212,220,255,0.72)", fontSize: 14, marginBottom: 8 }}>Disponível</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{moeda(cartaoAtivo.limite - cartaoAtivo.usado)}</div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Compras</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                placeholder="Buscar compra"
                style={{
                  background: "rgba(9, 14, 33, 0.92)",
                  color: "#F3F6FF",
                  border: "1px solid rgba(122,146,255,0.18)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  minWidth: 180,
                  fontSize: 15,
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            {cartaoAtivo.compras.map((compra) => (
              <CompraLinha key={compra.id} compra={compra} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function Page() {
  const [mes, setMes] = useState("Março 2026");
  const [tab, setTab] = useState("cartoes");

  const itemStyle = {
    flex: 1,
    textAlign: "center",
    color: "rgba(231,236,255,0.9)",
    fontWeight: 700,
    fontSize: 16,
    padding: "12px 8px",
    borderRadius: 16,
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <main style={shellStyle()}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {tab === "inicio" && <HomeTab mes={mes} setMes={setMes} />}
        {tab === "contas" && (
          <PlaceholderSection
            titulo="Contas"
            subtitulo="Aqui entra a listagem e edição das contas bancárias."
          />
        )}
        {tab === "lancar" && (
          <PlaceholderSection
            titulo="Lançar"
            subtitulo="Aqui entra o formulário de receitas, despesas e pagamentos."
          />
        )}
        {tab === "cartoes" && <CartoesTab />}
        {tab === "mais" && (
          <PlaceholderSection
            titulo="Mais"
            subtitulo="Aqui entram categorias, filtros avançados e outras opções."
          />
        )}

        <div
          style={{
            position: "sticky",
            bottom: 16,
            marginTop: 24,
            background: "rgba(8, 14, 34, 0.92)",
            border: "1px solid rgba(122, 147, 255, 0.16)",
            borderRadius: 24,
            padding: 10,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            backdropFilter: "blur(14px)",
            boxShadow: "0 16px 34px rgba(0,0,0,0.28)",
          }}
        >
          <div style={{ ...itemStyle, background: tab === "inicio" ? "rgba(124, 92, 255, 0.16)" : "transparent" }} onClick={() => setTab("inicio")}>Início</div>
          <div style={{ ...itemStyle, background: tab === "contas" ? "rgba(124, 92, 255, 0.16)" : "transparent" }} onClick={() => setTab("contas")}>Contas</div>
          <div style={{ ...itemStyle, background: tab === "lancar" ? "rgba(124, 92, 255, 0.16)" : "transparent" }} onClick={() => setTab("lancar")}>Lançar</div>
          <div style={{ ...itemStyle, background: tab === "cartoes" ? "rgba(124, 92, 255, 0.16)" : "transparent" }} onClick={() => setTab("cartoes")}>Cartões</div>
          <div style={{ ...itemStyle, background: tab === "mais" ? "rgba(124, 92, 255, 0.16)" : "transparent" }} onClick={() => setTab("mais")}>Mais</div>
        </div>
      </div>
    </main>
  );
}

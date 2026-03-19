"use client";

import { useMemo, useState } from "react";

function moeda(v) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
}

const meses = [
  "Janeiro 2026","Fevereiro 2026","Março 2026","Abril 2026","Maio 2026","Junho 2026",
  "Julho 2026","Agosto 2026","Setembro 2026","Outubro 2026","Novembro 2026","Dezembro 2026"
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

function getDados(mes) {
  return dadosBase[mes] || {
    entradas: 0, saidas: 0, saldoContas: 0,
    cards: {
      fixas: { valor: 0, itens: 0 }, dividas: { valor: 0, itens: 0 }, cartoes: { valor: 0, itens: 0 },
      variaveis: { valor: 0, itens: 0 }, receitas: { valor: 0, itens: 0 },
    },
  };
}

function shellStyle() {
  return {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #18285d 0%, #09122e 38%, #050a19 100%)",
    color: "#F2F5FF",
    padding: "20px 16px 28px",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
    <div style={cardBase({
      background: destaque ? "rgba(124, 92, 255, 0.16)" : "rgba(12, 19, 44, 0.78)",
      border: destaque ? "1px solid rgba(124, 92, 255, 0.35)" : "1px solid rgba(120, 146, 255, 0.14)",
      minHeight: 108,
    })}>
      <div style={{ color: "rgba(222,228,255,0.78)", fontSize: 15, marginBottom: 10 }}>{titulo}</div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>{valor}</div>
    </div>
  );
}

function ResumoCard({ titulo, valor, itens }) {
  return (
    <div style={cardBase({ minHeight: 118 })}>
      <div style={{ color: "rgba(226,231,255,0.86)", fontSize: 16, marginBottom: 10, fontWeight: 600 }}>{titulo}</div>
      <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1 }}>{valor}</div>
      <div style={{ marginTop: 10, color: "rgba(200,208,245,0.72)", fontSize: 14 }}>{itens} item(ns)</div>
    </div>
  );
}

function Input(props) {
  return <input {...props} style={{ width: '100%', background: 'rgba(7,12,29,.92)', color: '#F3F6FF', border: '1px solid rgba(122,146,255,.18)', borderRadius: 14, padding: '12px 14px', fontSize: 15, outline: 'none', ...(props.style || {}) }} />
}
function Select(props) {
  return <select {...props} style={{ width: '100%', background: 'rgba(7,12,29,.92)', color: '#F3F6FF', border: '1px solid rgba(122,146,255,.18)', borderRadius: 14, padding: '12px 14px', fontSize: 15, outline: 'none', ...(props.style || {}) }} />
}
function Button({children, secondary, ...props}) {
  return <button {...props} style={{ width: '100%', background: secondary ? 'transparent' : 'linear-gradient(135deg,#6c7cff,#7b5cff)', color: '#fff', border: secondary ? '1px solid rgba(130,148,255,0.18)' : 'none', borderRadius: 14, padding: '12px 14px', fontWeight: 800, fontSize: 15, cursor: 'pointer', ...(props.style || {}) }}>{children}</button>
}

function HomeTab({ mes, setMes }) {
  const dados = useMemo(() => getDados(mes), [mes]);
  const saldoMes = dados.entradas - dados.saidas;
  return (
    <>
      <section style={{ ...cardBase({ borderRadius: 28, padding: '18px 18px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }) }}>
        <div>
          <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(91,126,255,0.18)', color: '#DCE5FF', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Controle Financeiro • V3.6</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Olá, Thiago</div>
          <div style={{ marginTop: 6, color: 'rgba(212,220,255,0.72)', fontSize: 15 }}>Home limpa e cartões completos.</div>
        </div>
        <Button secondary style={{ width: 120 }}>Sair</Button>
      </section>

      <section style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: 'rgba(224,230,255,0.8)', fontSize: 15, marginBottom: 8 }}>Mês principal</div>
          <Select value={mes} onChange={(e)=>setMes(e.target.value)} style={{ minWidth: 220 }}>
            {meses.map((m)=><option key={m}>{m}</option>)}
          </Select>
        </div>
      </section>

      <section style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
        <TopCard titulo="Saldo do mês" valor={moeda(saldoMes)} destaque />
        <TopCard titulo="Entradas" valor={moeda(dados.entradas)} />
        <TopCard titulo="Saídas" valor={moeda(dados.saidas)} />
        <TopCard titulo="Saldo em contas" valor={moeda(dados.saldoContas)} />
      </section>

      <section style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <ResumoCard titulo="Contas Fixas" valor={moeda(dados.cards.fixas.valor)} itens={dados.cards.fixas.itens} />
        <ResumoCard titulo="Dívidas" valor={moeda(dados.cards.dividas.valor)} itens={dados.cards.dividas.itens} />
        <ResumoCard titulo="Cartões" valor={moeda(dados.cards.cartoes.valor)} itens={dados.cards.cartoes.itens} />
        <ResumoCard titulo="Gastos Variáveis" valor={moeda(dados.cards.variaveis.valor)} itens={dados.cards.variaveis.itens} />
        <ResumoCard titulo="Receitas" valor={moeda(dados.cards.receitas.valor)} itens={dados.cards.receitas.itens} />
      </section>
    </>
  );
}

function ContasTab() {
  return <section style={cardBase({ borderRadius: 24, marginTop: 16, padding: 20 })}><div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Contas</div><div style={{ color: 'rgba(212,220,255,0.72)', fontSize: 15 }}>Aqui entram contas bancárias, saldos e movimentações.</div></section>;
}

function LancarTab() {
  return <section style={cardBase({ borderRadius: 24, marginTop: 16, padding: 20 })}><div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Lançar</div><div style={{ color: 'rgba(212,220,255,0.72)', fontSize: 15 }}>Aqui entra o formulário de receitas, despesas e pagamentos.</div></section>;
}

function CartoesTab() {
  const [cartoes, setCartoes] = useState([
    { id: 1, nome: 'Nubank', limite: 5000, fechamento: 10, vencimento: 17 },
    { id: 2, nome: 'Itaú Azul', limite: 3500, fechamento: 5, vencimento: 12 },
  ]);
  const [compras, setCompras] = useState([
    { id: 1, cartaoId: 1, descricao: 'Notebook', total: 2400, parcelas: 8, restantes: 6 },
    { id: 2, cartaoId: 2, descricao: 'Celular', total: 1800, parcelas: 10, restantes: 4 },
  ]);
  const [novoCartao, setNovoCartao] = useState({ nome: '', limite: '', fechamento: '', vencimento: '' });
  const [novaCompra, setNovaCompra] = useState({ cartaoId: '', descricao: '', total: '', parcelas: '' });
  const [antecipar, setAntecipar] = useState({ compraId: '', qtd: '' });

  const faturaAtual = compras.reduce((s, c) => s + (Number(c.total) / Number(c.parcelas || 1)), 0);
  const limiteTotal = cartoes.reduce((s, c) => s + Number(c.limite || 0), 0);
  const utilizado = compras.reduce((s, c) => s + Number(c.total || 0), 0);

  function addCartao(e) {
    e.preventDefault();
    if (!novoCartao.nome) return;
    setCartoes(prev => [...prev, {
      id: Date.now(),
      nome: novoCartao.nome,
      limite: Number(novoCartao.limite || 0),
      fechamento: Number(novoCartao.fechamento || 0),
      vencimento: Number(novoCartao.vencimento || 0),
    }]);
    setNovoCartao({ nome: '', limite: '', fechamento: '', vencimento: '' });
  }

  function addCompra(e) {
    e.preventDefault();
    if (!novaCompra.cartaoId || !novaCompra.descricao) return;
    setCompras(prev => [...prev, {
      id: Date.now(),
      cartaoId: Number(novaCompra.cartaoId),
      descricao: novaCompra.descricao,
      total: Number(novaCompra.total || 0),
      parcelas: Number(novaCompra.parcelas || 1),
      restantes: Number(novaCompra.parcelas || 1),
    }]);
    setNovaCompra({ cartaoId: '', descricao: '', total: '', parcelas: '' });
  }

  function anteciparParcelas(e) {
    e.preventDefault();
    if (!antecipar.compraId || !antecipar.qtd) return;
    setCompras(prev => prev.map(c => {
      if (c.id !== Number(antecipar.compraId)) return c;
      return { ...c, restantes: Math.max(0, c.restantes - Number(antecipar.qtd || 0)) };
    }));
    setAntecipar({ compraId: '', qtd: '' });
  }

  return (
    <div style={{ marginTop: 16, display: 'grid', gap: 16 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 14 }}>
        <TopCard titulo="Fatura estimada" valor={moeda(faturaAtual)} destaque />
        <TopCard titulo="Limite total" valor={moeda(limiteTotal)} />
        <TopCard titulo="Total em compras" valor={moeda(utilizado)} />
        <TopCard titulo="Cartões cadastrados" valor={String(cartoes.length)} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={cardBase({ borderRadius: 24, padding: 20 })}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Novo cartão</div>
          <form onSubmit={addCartao} style={{ display: 'grid', gap: 12 }}>
            <Input placeholder="Nome do cartão" value={novoCartao.nome} onChange={(e)=>setNovoCartao({...novoCartao, nome: e.target.value})} />
            <Input placeholder="Limite" type="number" value={novoCartao.limite} onChange={(e)=>setNovoCartao({...novoCartao, limite: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input placeholder="Fechamento" type="number" value={novoCartao.fechamento} onChange={(e)=>setNovoCartao({...novoCartao, fechamento: e.target.value})} />
              <Input placeholder="Vencimento" type="number" value={novoCartao.vencimento} onChange={(e)=>setNovoCartao({...novoCartao, vencimento: e.target.value})} />
            </div>
            <Button type="submit">Salvar cartão</Button>
          </form>
        </div>

        <div style={cardBase({ borderRadius: 24, padding: 20 })}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Nova compra</div>
          <form onSubmit={addCompra} style={{ display: 'grid', gap: 12 }}>
            <Select value={novaCompra.cartaoId} onChange={(e)=>setNovaCompra({...novaCompra, cartaoId: e.target.value})}>
              <option value="">Selecione o cartão</option>
              {cartoes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Input placeholder="Descrição da compra" value={novaCompra.descricao} onChange={(e)=>setNovaCompra({...novaCompra, descricao: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input placeholder="Valor total" type="number" value={novaCompra.total} onChange={(e)=>setNovaCompra({...novaCompra, total: e.target.value})} />
              <Input placeholder="Parcelas" type="number" value={novaCompra.parcelas} onChange={(e)=>setNovaCompra({...novaCompra, parcelas: e.target.value})} />
            </div>
            <Button type="submit">Adicionar compra</Button>
          </form>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={cardBase({ borderRadius: 24, padding: 20 })}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Cartões cadastrados</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {cartoes.map(c => (
              <div key={c.id} style={{ ...cardBase({ padding: 14, borderRadius: 18 }), boxShadow: 'none' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{c.nome}</div>
                <div style={{ color: 'rgba(212,220,255,0.72)', marginTop: 6 }}>Limite: {moeda(c.limite)}</div>
                <div style={{ color: 'rgba(212,220,255,0.72)', marginTop: 4 }}>Fecha dia {c.fechamento} • Vence dia {c.vencimento}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardBase({ borderRadius: 24, padding: 20 })}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Antecipar parcelas</div>
          <form onSubmit={anteciparParcelas} style={{ display: 'grid', gap: 12 }}>
            <Select value={antecipar.compraId} onChange={(e)=>setAntecipar({...antecipar, compraId: e.target.value})}>
              <option value="">Selecione a compra</option>
              {compras.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
            </Select>
            <Input placeholder="Quantidade de parcelas" type="number" value={antecipar.qtd} onChange={(e)=>setAntecipar({...antecipar, qtd: e.target.value})} />
            <Button type="submit">Antecipar</Button>
          </form>
        </div>
      </section>

      <section style={cardBase({ borderRadius: 24, padding: 20 })}>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Compras e parcelamentos</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {compras.map(compra => {
            const cartao = cartoes.find(c => c.id === compra.cartaoId);
            return (
              <div key={compra.id} style={{ ...cardBase({ padding: 14, borderRadius: 18 }), boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{compra.descricao}</div>
                    <div style={{ color: 'rgba(212,220,255,0.72)', marginTop: 6 }}>{cartao?.nome || 'Cartão'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800 }}>{moeda(compra.total)}</div>
                    <div style={{ color: 'rgba(212,220,255,0.72)', marginTop: 6 }}>{compra.restantes} de {compra.parcelas} restantes</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MaisTab() {
  return <section style={cardBase({ borderRadius: 24, marginTop: 16, padding: 20 })}><div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Mais</div><div style={{ color: 'rgba(212,220,255,0.72)', fontSize: 15 }}>Aqui entram categorias, configurações e módulos futuros.</div></section>;
}

export default function Page() {
  const [mes, setMes] = useState('Março 2026');
  const [tab, setTab] = useState('inicio');
  const itemStyle = {
    flex: 1, textAlign: 'center', color: 'rgba(231,236,255,0.9)', fontWeight: 700, fontSize: 16,
    padding: '12px 8px', borderRadius: 16, cursor: 'pointer', userSelect: 'none',
  };

  return (
    <main style={shellStyle()}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {tab === 'inicio' && <HomeTab mes={mes} setMes={setMes} />}
        {tab === 'contas' && <ContasTab />}
        {tab === 'lancar' && <LancarTab />}
        {tab === 'cartoes' && <CartoesTab />}
        {tab === 'mais' && <MaisTab />}

        <div style={{ position: 'sticky', bottom: 16, marginTop: 24, background: 'rgba(8, 14, 34, 0.92)', border: '1px solid rgba(122, 147, 255, 0.16)', borderRadius: 24, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, backdropFilter: 'blur(14px)', boxShadow: '0 16px 34px rgba(0,0,0,0.28)' }}>
          <div style={{ ...itemStyle, background: tab === 'inicio' ? 'rgba(124, 92, 255, 0.16)' : 'transparent' }} onClick={() => setTab('inicio')}>Início</div>
          <div style={{ ...itemStyle, background: tab === 'contas' ? 'rgba(124, 92, 255, 0.16)' : 'transparent' }} onClick={() => setTab('contas')}>Contas</div>
          <div style={{ ...itemStyle, background: tab === 'lancar' ? 'rgba(124, 92, 255, 0.16)' : 'transparent' }} onClick={() => setTab('lancar')}>Lançar</div>
          <div style={{ ...itemStyle, background: tab === 'cartoes' ? 'rgba(124, 92, 255, 0.16)' : 'transparent' }} onClick={() => setTab('cartoes')}>Cartões</div>
          <div style={{ ...itemStyle, background: tab === 'mais' ? 'rgba(124, 92, 255, 0.16)' : 'transparent' }} onClick={() => setTab('mais')}>Mais</div>
        </div>
      </div>
    </main>
  );
}

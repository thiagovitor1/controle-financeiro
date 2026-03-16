'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { brl } from '../lib/format';

const monthLabels = {
  '2026-03': 'Março 2026',
  '2026-04': 'Abril 2026',
  '2026-05': 'Maio 2026',
  '2026-06': 'Junho 2026',
  '2026-07': 'Julho 2026',
  '2026-08': 'Agosto 2026',
  '2026-09': 'Setembro 2026',
  '2026-10': 'Outubro 2026',
  '2026-11': 'Novembro 2026',
  '2026-12': 'Dezembro 2026'
};

const seedByMonth = {
  '2026-03': {
    received: 6894.07,
    paid: 7104.04,
    pending: 5375.07,
    nextIncome: 3188.45,
    projected: -2186.62,
    accounts: [
      { name: 'Itaú', balance: 81.42, type: 'Conta principal' },
      { name: 'Banco do Brasil', balance: 26.22, type: 'Carro' },
      { name: 'Nubank', balance: 7.49, type: 'Conta + cartão' }
    ],
    cards: [
      { name: 'Mercado Pago', bill: 1097.25, status: 'Pendente' },
      { name: 'Itaú Azul', bill: 2656.83, status: 'Pendente' },
      { name: 'Bradesco', bill: 548.00, status: 'Pendente' }
    ]
  },
  '2026-09': {
    received: 0,
    paid: 0,
    pending: 0,
    nextIncome: 9322.52,
    projected: -2652.02,
    accounts: [],
    cards: []
  },
  '2026-11': {
    received: 0,
    paid: 0,
    pending: 0,
    nextIncome: 12607.27,
    projected: 2090.94,
    accounts: [],
    cards: []
  },
  '2026-12': {
    received: 0,
    paid: 0,
    pending: 0,
    nextIncome: 27607.27,
    projected: 18173.78,
    accounts: [],
    cards: []
  }
};

function Chip({ status }) {
  const cls = status === 'Pago' ? 'good' : status === 'Pendente' ? 'warn' : 'good';
  return <span className={`chip ${cls}`}>{status}</span>;
}

function LoginScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) return setErr(error.message);
      setMsg('Conta criada. Verifique seu e-mail para confirmar o cadastro.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) return setErr(error.message);
  }

  return (
    <main className="page">
      <div className="loginBox card">
        <div className="badge">Controle Financeiro • V2</div>
        <h1 style={{ marginTop: 0 }}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="muted">Agora o sistema já está preparado para login e instalação como app.</p>

        <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 18 }}>
          {mode === 'signup' && (
            <input
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErr('');
              setMsg('');
            }}
          >
            {mode === 'login' ? 'Quero criar conta' : 'Já tenho conta'}
          </button>
        </form>

        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </div>
    </main>
  );
}

function Dashboard({ user }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const current = seedByMonth[selectedMonth] || seedByMonth['2026-03'];

  const alerts = useMemo(() => {
    const list = [];
    if (current.projected < 0) list.push({ text: 'O mês ainda fecha pressionado se nada mudar.', type: 'bad' });
    else list.push({ text: 'O mês fecha positivo.', type: 'good' });
    if (selectedMonth === '2026-09') list.push({ text: 'Setembro/2026 é o primeiro mês de alívio mais visível.', type: 'good' });
    if (selectedMonth === '2026-12') list.push({ text: 'Dezembro/2026 é o grande mês de folga por causa do 13º e bônus.', type: 'good' });
    list.push({ text: 'Abril/2027 continua sendo a virada estrutural com o fim da Bemol.', type: 'good' });
    return list;
  }, [selectedMonth, current.projected]);

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">Controle Financeiro • Painel</div>
        <h1 style={{ marginTop: 0 }}>Olá, {user?.user_metadata?.full_name || user?.email}</h1>
        <p className="muted">Essa é a V2 com login e estrutura PWA pronta para virar aplicativo no celular.</p>
      </section>

      <div className="topbar">
        <div>
          <div className="muted">Mês selecionado</div>
          <select className="monthSelect" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {Object.keys(monthLabels).map((m) => (
              <option key={m} value={m}>{monthLabels[m]}</option>
            ))}
          </select>
        </div>
        <button onClick={logout} style={{ width: 160 }}>Sair</button>
      </div>

      <section className="grid kpis" style={{ marginBottom: 18 }}>
        <div className="card"><div className="muted">Entradas recebidas</div><div className="kpiValue">{brl(current.received)}</div></div>
        <div className="card"><div className="muted">Pagamentos feitos</div><div className="kpiValue">{brl(current.paid)}</div></div>
        <div className="card"><div className="muted">Ainda falta pagar</div><div className="kpiValue">{brl(current.pending)}</div></div>
        <div className="card"><div className="muted">Próxima entrada</div><div className="kpiValue">{brl(current.nextIncome)}</div></div>
        <div className="card"><div className="muted">Saldo projetado</div><div className="kpiValue">{brl(current.projected)}</div></div>
      </section>

      <section className="grid cols2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Contas</h2>
          <div className="grid cols3">
            {(current.accounts.length ? current.accounts : seedByMonth['2026-03'].accounts).map((a) => (
              <div className="account" key={a.name}>
                <div style={{ fontWeight: 700 }}>{a.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{a.type}</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{brl(a.balance)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Leitura rápida</h2>
          <div className="grid" style={{ gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} className={`chip ${a.type === 'bad' ? 'bad' : 'good'}`} style={{ display: 'block' }}>
                {a.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid cols2" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Cartões</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Cartão</th>
                <th>Status</th>
                <th className="money">Fatura</th>
              </tr>
            </thead>
            <tbody>
              {(current.cards.length ? current.cards : seedByMonth['2026-03'].cards).map((card) => (
                <tr key={card.name}>
                  <td>{card.name}</td>
                  <td><Chip status={card.status} /></td>
                  <td className="money">{brl(card.bill)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Próximo passo da V3</h2>
          <ul className="muted" style={{ lineHeight: 1.8 }}>
            <li>Cadastrar contas no banco real</li>
            <li>Cadastrar despesas fixas</li>
            <li>Cadastrar cartões e parcelas</li>
            <li>Salvar tudo por usuário</li>
            <li>Aplicar regras multiusuário (RLS)</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <div className="card">Carregando...</div>
      </main>
    );
  }

  if (!session) return <LoginScreen />;

  return <Dashboard user={session.user} />;
}

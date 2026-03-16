'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { brl } from '../lib/format';

const MONTHS = {
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

function startEndFromMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

function monthDate(monthKey) {
  return `${monthKey}-01`;
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
        options: { data: { full_name: fullName } }
      });
      if (error) return setErr(error.message);
      setMsg('Conta criada. Confira o e-mail para confirmar o cadastro.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErr(error.message);
  }

  return (
    <main className="page">
      <div className="loginBox card">
        <div className="badge">Controle Financeiro • V3</div>
        <h1 style={{ marginTop: 0 }}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="muted">Agora o sistema já grava contas, categorias e lançamentos no banco.</p>

        <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 18 }}>
          {mode === 'signup' && (
            <input placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          )}
          <input placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">{mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
          <button type="button" className="secondary" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr(''); setMsg(''); }}>
            {mode === 'login' ? 'Quero criar conta' : 'Já tenho conta'}
          </button>
        </form>

        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </div>
    </main>
  );
}

function DashboardView({ summary, accounts, upcoming }) {
  return (
    <>
      <section className="grid kpis">
        <div className="card"><div className="muted">Entradas</div><div className="kpiValue">{brl(summary.income)}</div></div>
        <div className="card"><div className="muted">Saídas</div><div className="kpiValue">{brl(summary.expenses)}</div></div>
        <div className="card"><div className="muted">Saldo do mês</div><div className="kpiValue">{brl(summary.net)}</div></div>
        <div className="card"><div className="muted">Saldo em contas</div><div className="kpiValue">{brl(summary.accountsTotal)}</div></div>
      </section>

      <section className="grid cols2" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Contas</h2>
          <div className="grid cols3">
            {accounts.length ? accounts.map((a) => (
              <div className="account" key={a.id}>
                <div style={{ fontWeight: 700 }}>{a.name}</div>
                <div className="muted small">{a.kind}</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{brl(a.initial_balance)}</div>
              </div>
            )) : <div className="empty">Nenhuma conta cadastrada ainda.</div>}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Próximos vencimentos</h2>
          {upcoming.length ? (
            <table className="table">
              <thead><tr><th>Descrição</th><th>Data</th><th className="money">Valor</th></tr></thead>
              <tbody>
                {upcoming.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.tx_date}</td>
                    <td className="money">{brl(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty">Sem pendências próximas neste mês.</div>}
        </div>
      </section>
    </>
  );
}

function AccountsView({ accounts, onCreated }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState('corrente');
  const [initialBalance, setInitialBalance] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('accounts').insert({
      user_id: user.id,
      name,
      kind,
      initial_balance: Number(initialBalance || 0)
    });
    if (error) return setErr(error.message);
    setMsg('Conta criada com sucesso.');
    setName(''); setKind('corrente'); setInitialBalance('');
    onCreated?.();
  }

  return (
    <div className="grid cols2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Nova conta</h2>
        <form onSubmit={submit} className="stack">
          <input placeholder="Nome da conta" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="corrente">Conta corrente</option>
            <option value="digital">Conta digital</option>
            <option value="carteira">Carteira</option>
            <option value="investimento">Investimento</option>
          </select>
          <input placeholder="Saldo inicial" type="number" step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} />
          <button type="submit">Salvar conta</button>
        </form>
        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Suas contas</h2>
        {accounts.length ? (
          <table className="table">
            <thead><tr><th>Conta</th><th>Tipo</th><th className="money">Saldo inicial</th></tr></thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.kind}</td>
                  <td className="money">{brl(a.initial_balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="empty">Cadastre sua primeira conta.</div>}
      </div>
    </div>
  );
}

function CategoriesView({ categories, onCreated }) {
  const [name, setName] = useState('');
  const [categoryType, setCategoryType] = useState('despesa');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('categories').insert({
      user_id: user.id,
      name,
      category_type: categoryType
    });
    if (error) return setErr(error.message);
    setMsg('Categoria criada com sucesso.');
    setName('');
    onCreated?.();
  }

  return (
    <div className="grid cols2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Nova categoria</h2>
        <form onSubmit={submit} className="stack">
          <input placeholder="Nome da categoria" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={categoryType} onChange={(e) => setCategoryType(e.target.value)}>
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
            <option value="ambos">Ambos</option>
          </select>
          <button type="submit">Salvar categoria</button>
        </form>
        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Categorias</h2>
        {categories.length ? (
          <table className="table">
            <thead><tr><th>Categoria</th><th>Tipo</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.category_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="empty">Nenhuma categoria cadastrada.</div>}
      </div>
    </div>
  );
}

function LaunchView({ accounts, categories, selectedMonth, onCreated }) {
  const [txType, setTxType] = useState('despesa');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [txDate, setTxDate] = useState(`${selectedMonth}-01`);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('confirmado');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function ensureMonth(userId) {
    const month_ref = monthDate(selectedMonth);
    const { data: existing } = await supabase
      .from('monthly_periods')
      .select('*')
      .eq('user_id', userId)
      .eq('month_ref', month_ref)
      .maybeSingle();

    if (existing) return existing.id;

    const { data, error } = await supabase
      .from('monthly_periods')
      .insert({ user_id: userId, month_ref, label: MONTHS[selectedMonth] })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  async function submit(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    try {
      const monthId = await ensureMonth(user.id);
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        month_id: monthId,
        account_id: accountId || null,
        category_id: categoryId || null,
        tx_date: txDate,
        tx_type: txType,
        description,
        amount: Number(amount || 0),
        status
      });
      if (error) return setErr(error.message);
      setMsg('Lançamento salvo com sucesso.');
      setDescription('');
      setAmount('');
      onCreated?.();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Novo lançamento</h2>
      <form onSubmit={submit} className="stack">
        <div className="row">
          <select value={txType} onChange={(e) => setTxType(e.target.value)}>
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
            <option value="pagamento_cartao">Pagamento cartão</option>
          </select>
          <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} />
        </div>
        <div className="row">
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">Selecione a conta</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Selecione a categoria</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <input placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="row">
          <input placeholder="Valor" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="confirmado">Confirmado</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
        <button type="submit">Salvar lançamento</button>
      </form>
      {err && <div className="error">{err}</div>}
      {msg && <div className="success">{msg}</div>}
    </div>
  );
}

function TransactionsView({ transactions }) {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Lançamentos do mês</h2>
      {transactions.length ? (
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th className="money">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.tx_date}</td>
                <td>{t.description}</td>
                <td>{t.tx_type}</td>
                <td className="money">{brl(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div className="empty">Ainda não há lançamentos neste mês.</div>}
    </div>
  );
}

function AppShell({ session }) {
  const [tab, setTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  async function ensureProfile() {
    const user = session.user;
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email
    });
  }

  async function loadAll() {
    setLoadingData(true);
    const userId = session.user.id;
    const { start, end } = startEndFromMonth(selectedMonth);

    const [accountsRes, categoriesRes, txRes, upcomingRes] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('categories').select('*').eq('user_id', userId).order('name'),
      supabase.from('transactions').select('*').eq('user_id', userId).gte('tx_date', start).lte('tx_date', end).order('tx_date', { ascending: false }),
      supabase.from('transactions').select('*').eq('user_id', userId).eq('status', 'pendente').gte('tx_date', start).lte('tx_date', end).order('tx_date', { ascending: true }).limit(5)
    ]);

    setAccounts(accountsRes.data || []);
    setCategories(categoriesRes.data || []);
    setTransactions(txRes.data || []);
    setUpcoming(upcomingRes.data || []);
    setLoadingData(false);
  }

  useEffect(() => {
    ensureProfile().then(loadAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.tx_type === 'receita').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.tx_type !== 'receita').reduce((s, t) => s + Number(t.amount), 0);
    const accountsTotal = accounts.reduce((s, a) => s + Number(a.initial_balance || 0), 0);
    return { income, expenses, net: income - expenses, accountsTotal };
  }, [transactions, accounts]);

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loadingData) {
    return <main className="page"><div className="card">Carregando dados...</div></main>;
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">Controle Financeiro • Painel</div>
        <h1 style={{ marginTop: 0 }}>Olá, {session.user.user_metadata?.full_name || session.user.email}</h1>
        <p className="muted">V3.1: contas, categorias e lançamentos já funcionando com dados reais no Supabase.</p>
      </section>

      <div className="topbar">
        <div>
          <div className="muted">Mês selecionado</div>
          <select className="monthSelect" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {Object.entries(MONTHS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <button onClick={logout} style={{ width: 160 }}>Sair</button>
      </div>

      {tab === 'dashboard' && <DashboardView summary={summary} accounts={accounts} upcoming={upcoming} />}
      {tab === 'accounts' && <AccountsView accounts={accounts} onCreated={loadAll} />}
      {tab === 'launch' && (
        <div className="grid cols2">
          <LaunchView accounts={accounts} categories={categories} selectedMonth={selectedMonth} onCreated={loadAll} />
          <TransactionsView transactions={transactions} />
        </div>
      )}
      {tab === 'categories' && <CategoriesView categories={categories} onCreated={loadAll} />}

      <div className="bottomNav">
        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>Início</button>
        <button className={tab === 'accounts' ? 'active' : ''} onClick={() => setTab('accounts')}>Contas</button>
        <button className={tab === 'launch' ? 'active' : ''} onClick={() => setTab('launch')}>Lançar</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categorias</button>
      </div>
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <main className="page"><div className="card">Carregando...</div></main>;
  if (!session) return <LoginScreen />;
  return <AppShell session={session} />;
}

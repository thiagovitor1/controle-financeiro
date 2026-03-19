
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

const FIXED_KEYWORDS = ['aluguel','condom','energia','internet','vivo','claro','faculdade','pensão','agua','água','apartamento','carro','seguro'];
const DEBT_KEYWORDS = ['empréstimo','emprestimo','financiamento','acordo','bemol','dívida','divida'];

function startEndFromMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}
function monthDate(monthKey) { return `${monthKey}-01`; }
function addMonths(dateString, monthsToAdd) {
  const d = new Date(dateString + 'T12:00:00');
  d.setMonth(d.getMonth() + monthsToAdd);
  return d.toISOString().slice(0, 10);
}
function includesKeyword(text, keywords) {
  const normalized = String(text || '').toLowerCase();
  return keywords.some((k) => normalized.includes(k));
}
function classifyTransaction(tx) {
  if (tx.tx_type === 'receita') return 'receitas';
  if (tx.tx_type === 'pagamento_cartao') return 'cartoes';
  if (includesKeyword(tx.description, DEBT_KEYWORDS)) return 'dividas';
  if (includesKeyword(tx.description, FIXED_KEYWORDS)) return 'contas_fixas';
  return 'gastos_variaveis';
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
        <div className="badge">Controle Financeiro • V3.3</div>
        <h1 style={{ marginTop: 0 }}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="muted">Home reorganizada com 5 cards e filtros por mês e descrição.</p>
        <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 18 }}>
          {mode === 'signup' && <input placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />}
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

function SummaryCard({ title, total, count, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="card" style={{ textAlign: 'left', borderColor: active ? '#4f86ff' : undefined, background: active ? 'rgba(27,40,68,.98)' : undefined }}>
      <div className="muted">{title}</div>
      <div className="kpiValue">{brl(total)}</div>
      <div className="small muted" style={{ marginTop: 6 }}>{count} item(ns)</div>
    </button>
  );
}

function DetailPanel({ title, items, filterMonth, setFilterMonth, filterText, setFilterText, totalLabel }) {
  return (
    <div className="card" style={{ marginTop: 18 }}>
      <div className="row" style={{ alignItems: 'end', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <div className="muted small" style={{ marginTop: 6 }}>{totalLabel}</div>
        </div>
        <div className="row">
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            {Object.entries(MONTHS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <input placeholder="Filtrar por descrição" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        </div>
      </div>

      {items.length ? (
        <table className="table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Data</th>
              <th>Tipo</th>
              <th className="money">Valor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.source}-${item.id}`}>
                <td>{item.description}</td>
                <td>{item.date}</td>
                <td>{item.kindLabel}</td>
                <td className="money">{brl(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div className="empty">Nenhum item encontrado com os filtros atuais.</div>}
    </div>
  );
}

function DashboardView({ summary, accounts, cards, transactionsByMonth, installmentsByMonth, selectedCard, setSelectedCard, detailMonth, setDetailMonth, detailText, setDetailText }) {
  const baseItems = useMemo(() => {
    const txItems = (transactionsByMonth || []).map((tx) => ({
      id: tx.id,
      source: 'tx',
      bucket: classifyTransaction(tx),
      description: tx.description,
      date: tx.tx_date,
      amount: Number(tx.amount || 0),
      kindLabel: tx.tx_type
    }));

    const cardItems = (cards || []).map((card) => ({
      id: card.id,
      source: 'card',
      bucket: 'cartoes',
      description: card.name,
      date: `fecha ${card.closing_day} / vence ${card.due_day}`,
      amount: Number(card.limit_amount || 0),
      kindLabel: 'cartão'
    }));

    const installmentItems = (installmentsByMonth || []).map((inst) => ({
      id: inst.id,
      source: 'inst',
      bucket: 'cartoes',
      description: inst.card_purchases?.description || 'Compra parcelada',
      date: inst.installment_date,
      amount: Number(inst.installment_amount || 0),
      kindLabel: inst.status
    }));

    return [...txItems, ...cardItems, ...installmentItems];
  }, [transactionsByMonth, installmentsByMonth, cards]);

  const filteredItems = useMemo(() => {
    return baseItems.filter((item) => {
      const matchesCard = item.bucket === selectedCard;
      const matchesText = !detailText || item.description.toLowerCase().includes(detailText.toLowerCase());
      return matchesCard && matchesText;
    });
  }, [baseItems, selectedCard, detailText]);

  const totalSelected = filteredItems.reduce((s, i) => s + Number(i.amount || 0), 0);

  return (
    <>
      <section className="grid kpis">
        <div className="card"><div className="muted">Saldo do mês</div><div className="kpiValue">{brl(summary.net)}</div></div>
        <div className="card"><div className="muted">Entradas</div><div className="kpiValue">{brl(summary.income)}</div></div>
        <div className="card"><div className="muted">Saídas</div><div className="kpiValue">{brl(summary.expenses)}</div></div>
        <div className="card"><div className="muted">Saldo em contas</div><div className="kpiValue">{brl(summary.accountsTotal)}</div></div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 18 }}>
        <SummaryCard title="Contas Fixas" total={summary.fixedTotal} count={summary.fixedCount} active={selectedCard === 'contas_fixas'} onClick={() => setSelectedCard('contas_fixas')} />
        <SummaryCard title="Dívidas" total={summary.debtTotal} count={summary.debtCount} active={selectedCard === 'dividas'} onClick={() => setSelectedCard('dividas')} />
        <SummaryCard title="Cartões" total={summary.cardsTotal} count={summary.cardsCount} active={selectedCard === 'cartoes'} onClick={() => setSelectedCard('cartoes')} />
        <SummaryCard title="Gastos Variáveis" total={summary.variableTotal} count={summary.variableCount} active={selectedCard === 'gastos_variaveis'} onClick={() => setSelectedCard('gastos_variaveis')} />
        <SummaryCard title="Receitas" total={summary.incomeTotal} count={summary.incomeCount} active={selectedCard === 'receitas'} onClick={() => setSelectedCard('receitas')} />
      </section>

      <DetailPanel
        title={
          selectedCard === 'contas_fixas' ? 'Contas Fixas' :
          selectedCard === 'dividas' ? 'Dívidas' :
          selectedCard === 'cartoes' ? 'Cartões' :
          selectedCard === 'gastos_variaveis' ? 'Gastos Variáveis' :
          'Receitas'
        }
        items={filteredItems}
        filterMonth={detailMonth}
        setFilterMonth={setDetailMonth}
        filterText={detailText}
        setFilterText={setDetailText}
        totalLabel={`Total filtrado: ${brl(totalSelected)}`}
      />

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
          <h2 style={{ marginTop: 0 }}>Cartões cadastrados</h2>
          {cards.length ? (
            <table className="table">
              <thead><tr><th>Cartão</th><th>Fech./Venc.</th><th className="money">Limite</th></tr></thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.closing_day}/{c.due_day}</td>
                    <td className="money">{brl(c.limit_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty">Nenhum cartão cadastrado.</div>}
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

function LaunchView({ accounts, categories, selectedMonth, transactions, onCreated }) {
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
    const { data: existing } = await supabase.from('monthly_periods').select('*').eq('user_id', userId).eq('month_ref', month_ref).maybeSingle();
    if (existing) return existing.id;
    const { data, error } = await supabase.from('monthly_periods').insert({ user_id: userId, month_ref, label: MONTHS[selectedMonth] }).select().single();
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
      setDescription(''); setAmount('');
      onCreated?.();
    } catch (e) { setErr(e.message); }
  }

  return (
    <div className="grid cols2">
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

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Lançamentos do mês</h2>
        {transactions.length ? (
          <table className="table">
            <thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th className="money">Valor</th></tr></thead>
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
    </div>
  );
}

function CardsView({ cards, purchases, installments, selectedMonth, onCreated }) {
  const [name, setName] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [closingDay, setClosingDay] = useState('10');
  const [dueDay, setDueDay] = useState('17');
  const [cardId, setCardId] = useState('');
  const [purchaseDesc, setPurchaseDesc] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(`${selectedMonth}-01`);
  const [installmentsCount, setInstallmentsCount] = useState('1');
  const [selectedPurchase, setSelectedPurchase] = useState('');
  const [advanceCount, setAdvanceCount] = useState('1');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function ensureMonth(userId, monthRef) {
    const { data: existing } = await supabase.from('monthly_periods').select('*').eq('user_id', userId).eq('month_ref', monthRef).maybeSingle();
    if (existing) return existing.id;
    const label = MONTHS[monthRef.slice(0, 7)] || monthRef;
    const { data, error } = await supabase.from('monthly_periods').insert({ user_id: userId, month_ref: monthRef, label }).select().single();
    if (error) throw error;
    return data.id;
  }

  async function createCard(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('credit_cards').insert({
      user_id: user.id,
      name,
      limit_amount: Number(limitAmount || 0),
      closing_day: Number(closingDay),
      due_day: Number(dueDay)
    });
    if (error) return setErr(error.message);
    setMsg('Cartão criado com sucesso.');
    setName(''); setLimitAmount('');
    onCreated?.();
  }

  async function createPurchase(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    const total = Number(purchaseAmount || 0);
    const count = Number(installmentsCount || 1);
    const installmentValue = Number((total / count).toFixed(2));

    const { data: purchase, error } = await supabase.from('card_purchases').insert({
      user_id: user.id,
      card_id: cardId,
      description: purchaseDesc,
      purchase_date: purchaseDate,
      total_amount: total,
      installments_count: count
    }).select().single();

    if (error) return setErr(error.message);

    for (let i = 1; i <= count; i++) {
      const date = addMonths(purchaseDate, i - 1);
      const monthRef = `${date.slice(0,7)}-01`;
      const monthId = await ensureMonth(user.id, monthRef);
      await supabase.from('installments').insert({
        user_id: user.id,
        purchase_id: purchase.id,
        card_id: cardId,
        month_id: monthId,
        installment_number: i,
        installment_amount: installmentValue,
        installment_date: date,
        status: 'ativa'
      });
    }

    setMsg('Compra parcelada criada com sucesso.');
    setCardId(''); setPurchaseDesc(''); setPurchaseAmount(''); setInstallmentsCount('1');
    onCreated?.();
  }

  async function advanceInstallments(e) {
    e.preventDefault();
    setErr(''); setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    const count = Number(advanceCount || 1);

    const { data: openInstallments, error: loadError } = await supabase
      .from('installments')
      .select('*')
      .eq('purchase_id', selectedPurchase)
      .eq('status', 'ativa')
      .order('installment_number', { ascending: true })
      .limit(count);

    if (loadError) return setErr(loadError.message);
    if (!openInstallments || !openInstallments.length) return setErr('Não há parcelas ativas para antecipar.');

    const totalAdvance = openInstallments.reduce((s, i) => s + Number(i.installment_amount), 0);

    const { error: adjError } = await supabase.from('installment_adjustments').insert({
      user_id: user.id,
      purchase_id: selectedPurchase,
      adjustment_type: 'antecipacao_parcial',
      installments_affected: openInstallments.length,
      adjustment_amount: totalAdvance,
      adjustment_date: new Date().toISOString().slice(0, 10),
      notes: 'Antecipação feita pelo app'
    });
    if (adjError) return setErr(adjError.message);

    const ids = openInstallments.map((i) => i.id);
    const { error: updateError } = await supabase.from('installments').update({ status: 'antecipada' }).in('id', ids);
    if (updateError) return setErr(updateError.message);

    setMsg(`Antecipação registrada. Valor total: ${brl(totalAdvance)}`);
    onCreated?.();
  }

  return (
    <div className="grid cols2">
      <div className="stack">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Novo cartão</h2>
          <form onSubmit={createCard} className="stack">
            <input placeholder="Nome do cartão" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Limite" type="number" step="0.01" value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} />
            <div className="row">
              <input placeholder="Fechamento" type="number" value={closingDay} onChange={(e) => setClosingDay(e.target.value)} />
              <input placeholder="Vencimento" type="number" value={dueDay} onChange={(e) => setDueDay(e.target.value)} />
            </div>
            <button type="submit">Salvar cartão</button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Nova compra parcelada</h2>
          <form onSubmit={createPurchase} className="stack">
            <select value={cardId} onChange={(e) => setCardId(e.target.value)}>
              <option value="">Selecione o cartão</option>
              {cards.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Descrição da compra" value={purchaseDesc} onChange={(e) => setPurchaseDesc(e.target.value)} />
            <div className="row">
              <input placeholder="Valor total" type="number" step="0.01" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} />
              <input placeholder="Parcelas" type="number" min="1" value={installmentsCount} onChange={(e) => setInstallmentsCount(e.target.value)} />
            </div>
            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            <button type="submit">Criar compra parcelada</button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Antecipar parcelas</h2>
          <form onSubmit={advanceInstallments} className="stack">
            <select value={selectedPurchase} onChange={(e) => setSelectedPurchase(e.target.value)}>
              <option value="">Selecione a compra</option>
              {purchases.map((p) => <option key={p.id} value={p.id}>{p.description}</option>)}
            </select>
            <input placeholder="Quantidade de parcelas" type="number" min="1" value={advanceCount} onChange={(e) => setAdvanceCount(e.target.value)} />
            <button type="submit">Antecipar parcelas</button>
          </form>
        </div>

        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </div>

      <div className="stack">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Cartões</h2>
          {cards.length ? (
            <table className="table">
              <thead><tr><th>Cartão</th><th>Fech./Venc.</th><th className="money">Limite</th></tr></thead>
              <tbody>
                {cards.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.closing_day}/{c.due_day}</td>
                    <td className="money">{brl(c.limit_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty">Nenhum cartão cadastrado.</div>}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Parcelas</h2>
          {installments.length ? (
            <table className="table">
              <thead><tr><th>Compra</th><th>Parcela</th><th>Status</th><th className="money">Valor</th></tr></thead>
              <tbody>
                {installments.map((i) => (
                  <tr key={i.id}>
                    <td>{i.card_purchases?.description || 'Compra'}</td>
                    <td>{i.installment_number}</td>
                    <td><span className={`chip ${i.status === 'ativa' ? 'warn' : 'good'}`}>{i.status}</span></td>
                    <td className="money">{brl(i.installment_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty">Sem parcelas criadas ainda.</div>}
        </div>
      </div>
    </div>
  );
}

function AppShell({ session }) {
  const [tab, setTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [detailMonth, setDetailMonth] = useState('2026-03');
  const [detailText, setDetailText] = useState('');
  const [selectedCard, setSelectedCard] = useState('contas_fixas');
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [transactionsByDetailMonth, setTransactionsByDetailMonth] = useState([]);
  const [installmentsByDetailMonth, setInstallmentsByDetailMonth] = useState([]);
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
    const detailRange = startEndFromMonth(detailMonth);

    const [accountsRes, categoriesRes, txRes, cardsRes, purchasesRes, instRes, detailTxRes, detailInstRes] = await Promise.all([
      supabase.from('accounts').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('categories').select('*').eq('user_id', userId).order('name'),
      supabase.from('transactions').select('*').eq('user_id', userId).gte('tx_date', start).lte('tx_date', end).order('tx_date', { ascending: false }),
      supabase.from('credit_cards').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('card_purchases').select('*').eq('user_id', userId).order('purchase_date', { ascending: false }),
      supabase.from('installments').select('*, card_purchases(description)').eq('user_id', userId).order('installment_date', { ascending: true }),
      supabase.from('transactions').select('*').eq('user_id', userId).gte('tx_date', detailRange.start).lte('tx_date', detailRange.end).order('tx_date', { ascending: false }),
      supabase.from('installments').select('*, card_purchases(description)').eq('user_id', userId).gte('installment_date', detailRange.start).lte('installment_date', detailRange.end).order('installment_date', { ascending: true })
    ]);

    setAccounts(accountsRes.data || []);
    setCategories(categoriesRes.data || []);
    setTransactions(txRes.data || []);
    setCards(cardsRes.data || []);
    setPurchases(purchasesRes.data || []);
    setInstallments(instRes.data || []);
    setTransactionsByDetailMonth(detailTxRes.data || []);
    setInstallmentsByDetailMonth(detailInstRes.data || []);
    setLoadingData(false);
  }

  useEffect(() => {
    ensureProfile().then(loadAll);
  }, [selectedMonth, detailMonth]);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.tx_type === 'receita').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.tx_type !== 'receita').reduce((s, t) => s + Number(t.amount), 0);
    const accountsTotal = accounts.reduce((s, a) => s + Number(a.initial_balance || 0), 0);

    const txClassified = transactions.map((t) => ({ ...t, bucket: classifyTransaction(t) }));
    const fixed = txClassified.filter(t => t.bucket === 'contas_fixas');
    const debts = txClassified.filter(t => t.bucket === 'dividas');
    const variable = txClassified.filter(t => t.bucket === 'gastos_variaveis');
    const incomes = txClassified.filter(t => t.bucket === 'receitas');
    const cardsFromTx = txClassified.filter(t => t.bucket === 'cartoes');
    const cardsFromInstallments = installments.filter(i => i.status === 'ativa');

    return {
      income,
      expenses,
      net: income - expenses,
      accountsTotal,
      fixedTotal: fixed.reduce((s, i) => s + Number(i.amount || 0), 0),
      fixedCount: fixed.length,
      debtTotal: debts.reduce((s, i) => s + Number(i.amount || 0), 0),
      debtCount: debts.length,
      variableTotal: variable.reduce((s, i) => s + Number(i.amount || 0), 0),
      variableCount: variable.length,
      incomeTotal: incomes.reduce((s, i) => s + Number(i.amount || 0), 0),
      incomeCount: incomes.length,
      cardsTotal: cardsFromTx.reduce((s, i) => s + Number(i.amount || 0), 0) + cardsFromInstallments.reduce((s, i) => s + Number(i.installment_amount || 0), 0),
      cardsCount: cards.length + cardsFromInstallments.length
    };
  }, [transactions, accounts, cards, installments]);

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loadingData) return <main className="page"><div className="card">Carregando dados...</div></main>;

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">Controle Financeiro • V3.3</div>
        <h1 style={{ marginTop: 0 }}>Olá, {session.user.user_metadata?.full_name || session.user.email}</h1>
        <p className="muted">Início reorganizado com 5 cards: Contas Fixas, Dívidas, Cartões, Gastos Variáveis e Receitas.</p>
      </section>

      <div className="topbar">
        <div>
          <div className="muted">Mês principal</div>
          <select className="monthSelect" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {Object.entries(MONTHS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <button onClick={logout} style={{ width: 160 }}>Sair</button>
      </div>

      {tab === 'dashboard' && (
        <DashboardView
          summary={summary}
          accounts={accounts}
          cards={cards}
          transactionsByMonth={transactionsByDetailMonth}
          installmentsByMonth={installmentsByDetailMonth}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          detailMonth={detailMonth}
          setDetailMonth={setDetailMonth}
          detailText={detailText}
          setDetailText={setDetailText}
        />
      )}

      {tab === 'accounts' && <AccountsView accounts={accounts} onCreated={loadAll} />}
      {tab === 'launch' && <LaunchView accounts={accounts} categories={categories} selectedMonth={selectedMonth} transactions={transactions} onCreated={loadAll} />}
      {tab === 'cards' && <CardsView cards={cards} purchases={purchases} installments={installments} selectedMonth={selectedMonth} onCreated={loadAll} />}
      {tab === 'categories' && <CategoriesView categories={categories} onCreated={loadAll} />}

      <div className="bottomNav">
        <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>Início</button>
        <button className={tab === 'accounts' ? 'active' : ''} onClick={() => setTab('accounts')}>Contas</button>
        <button className={tab === 'launch' ? 'active' : ''} onClick={() => setTab('launch')}>Lançar</button>
        <button className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>Cartões</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Mais</button>
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

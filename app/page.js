'use client';

import { useMemo, useState } from 'react';

const cardsSeed = [
  {
    id: 'nubank',
    name: 'Nubank',
    limit: 8800,
    closingDay: 25,
    dueDay: 1,
    invoice: 3280,
    purchases: [
      { id: '1', title: 'Notebook Dell', category: 'Tecnologia', date: '12/03/2026', amount: 2400, installment: '8 de 12' },
      { id: '2', title: 'Mercado', category: 'Alimentação', date: '18/03/2026', amount: 480, installment: 'à vista' },
      { id: '3', title: 'Passagem', category: 'Transporte', date: '20/03/2026', amount: 400, installment: '2 de 4' },
    ],
  },
  {
    id: 'itau-azul',
    name: 'Itaú Azul',
    limit: 3500,
    closingDay: 5,
    dueDay: 12,
    invoice: 920,
    purchases: [
      { id: '4', title: 'Farmácia', category: 'Saúde', date: '10/03/2026', amount: 180, installment: 'à vista' },
      { id: '5', title: 'Uber', category: 'Mobilidade', date: '14/03/2026', amount: 64, installment: 'à vista' },
    ],
  },
];

function brl(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function IconButton({ children, onClick, label }) {
  return (
    <button aria-label={label} onClick={onClick} style={styles.iconButton}>
      {children}
    </button>
  );
}

export default function Page() {
  const [cards, setCards] = useState(cardsSeed);
  const [selectedId, setSelectedId] = useState(cardsSeed[0].id);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ limit: '', closingDay: '', dueDay: '' });

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedId) || cards[0],
    [cards, selectedId]
  );

  const filteredPurchases = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return selectedCard.purchases;
    return selectedCard.purchases.filter((item) =>
      [item.title, item.category, item.date, item.installment].join(' ').toLowerCase().includes(term)
    );
  }, [selectedCard, search]);

  const available = selectedCard.limit - selectedCard.invoice;

  function openEdit() {
    setEditForm({
      limit: String(selectedCard.limit),
      closingDay: String(selectedCard.closingDay),
      dueDay: String(selectedCard.dueDay),
    });
    setEditing(true);
  }

  function saveEdit() {
    setCards((current) =>
      current.map((card) =>
        card.id === selectedId
          ? {
              ...card,
              limit: Number(editForm.limit) || card.limit,
              closingDay: Number(editForm.closingDay) || card.closingDay,
              dueDay: Number(editForm.dueDay) || card.dueDay,
            }
          : card
      )
    );
    setEditing(false);
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionLabel}>Cartão selecionado</div>
            </div>
            <IconButton label="Novo cartão" onClick={() => alert('Abrir cadastro de novo cartão')}>
              ＋
            </IconButton>
          </div>

          <div style={styles.selectWrap}>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={styles.select}>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <div style={styles.cardTopRow}>
            <div>
              <div style={styles.cardNameRow}>
                <h1 style={styles.cardName}>{selectedCard.name}</h1>
                <IconButton label="Editar cartão" onClick={openEdit}>✎</IconButton>
              </div>
              <p style={styles.cardMeta}>Fecha dia {selectedCard.closingDay} • Vence dia {selectedCard.dueDay}</p>
            </div>
            <div style={styles.invoiceWrap}>
              <div style={styles.invoiceLabel}>Fatura atual</div>
              <div style={styles.invoiceValue}>{brl(selectedCard.invoice)}</div>
            </div>
          </div>

          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Limite total</span>
              <strong style={styles.kpiValue}>{brl(selectedCard.limit)}</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Fechamento</span>
              <strong style={styles.kpiValue}>{selectedCard.closingDay}</strong>
            </div>
            <div style={styles.kpiCard}>
              <span style={styles.kpiLabel}>Vencimento</span>
              <strong style={styles.kpiValue}>{selectedCard.dueDay}</strong>
            </div>
            <div style={{ ...styles.kpiCard, ...styles.kpiHighlight }}>
              <span style={styles.kpiLabel}>Disponível</span>
              <strong style={styles.kpiValue}>{brl(available)}</strong>
            </div>
          </div>

          {editing && (
            <div style={styles.editPanel}>
              <div style={styles.formGrid}>
                <input
                  style={styles.input}
                  value={editForm.limit}
                  onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
                  placeholder="Limite total"
                />
                <input
                  style={styles.input}
                  value={editForm.closingDay}
                  onChange={(e) => setEditForm({ ...editForm, closingDay: e.target.value })}
                  placeholder="Fechamento"
                />
                <input
                  style={styles.input}
                  value={editForm.dueDay}
                  onChange={(e) => setEditForm({ ...editForm, dueDay: e.target.value })}
                  placeholder="Vencimento"
                />
              </div>
              <div style={styles.actionsRow}>
                <button style={styles.primaryButton} onClick={saveEdit}>Salvar alterações</button>
                <button style={styles.secondaryButton} onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </section>

        <section style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Compras</h2>
            <IconButton label="Nova compra" onClick={() => alert('Abrir cadastro de nova compra')}>＋</IconButton>
          </div>

          <input
            style={styles.input}
            placeholder="Buscar compra"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div style={styles.list}>
            {filteredPurchases.map((item) => (
              <div key={item.id} style={styles.purchaseRow}>
                <div>
                  <div style={styles.purchaseTitle}>{item.title}</div>
                  <div style={styles.purchaseMeta}>{item.date} • {item.category}</div>
                </div>
                <div style={styles.purchaseAmount}>{brl(item.amount)}</div>
                <div style={styles.purchaseInstallment}>{item.installment}</div>
                <button style={styles.ghostButton}>Antecipar</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #1f2f74 0%, #06113a 45%, #020817 100%)',
    color: '#eef2ff',
    fontFamily: 'Inter, Arial, sans-serif',
    padding: 16,
  },
  shell: {
    width: '100%',
    maxWidth: 980,
    margin: '0 auto',
    display: 'grid',
    gap: 16,
  },
  sectionCard: {
    background: 'rgba(8, 16, 48, 0.9)',
    border: '1px solid rgba(129, 140, 248, 0.18)',
    borderRadius: 28,
    padding: 20,
    boxShadow: '0 10px 35px rgba(0,0,0,0.22)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  sectionLabel: { fontSize: 16, color: '#b7c0e5' },
  sectionTitle: { margin: 0, fontSize: 24 },
  selectWrap: { width: '100%' },
  select: {
    width: '100%', background: '#030b2d', color: '#fff', border: '1px solid rgba(129,140,248,.22)',
    borderRadius: 18, padding: '18px 16px', fontSize: 18, outline: 'none'
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 14, border: '1px solid rgba(129,140,248,.28)', background: 'rgba(99,102,241,.18)',
    color: '#fff', fontSize: 24, cursor: 'pointer'
  },
  cardTopRow: { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' },
  cardNameRow: { display: 'flex', alignItems: 'center', gap: 10 },
  cardName: { fontSize: 34, margin: 0 },
  cardMeta: { margin: '6px 0 0', color: '#b7c0e5', fontSize: 18 },
  invoiceWrap: { textAlign: 'right' },
  invoiceLabel: { color: '#b7c0e5', fontSize: 16 },
  invoiceValue: { fontSize: 34, fontWeight: 800 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14, marginTop: 18 },
  kpiCard: { background: '#071140', border: '1px solid rgba(129,140,248,.18)', borderRadius: 22, padding: 18, minHeight: 104 },
  kpiHighlight: { background: 'rgba(99,102,241,.22)' },
  kpiLabel: { display: 'block', color: '#b7c0e5', fontSize: 16, marginBottom: 10 },
  kpiValue: { fontSize: 28, lineHeight: 1.1 },
  editPanel: { marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(129,140,248,.15)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 },
  input: {
    width: '100%', background: '#030b2d', color: '#fff', border: '1px solid rgba(129,140,248,.22)', borderRadius: 16,
    padding: '16px 14px', fontSize: 18, outline: 'none', boxSizing: 'border-box'
  },
  actionsRow: { display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  primaryButton: {
    background: 'linear-gradient(90deg,#7180ff,#8a63ff)', color: '#fff', border: 0, borderRadius: 16, padding: '14px 18px', fontSize: 18, fontWeight: 700
  },
  secondaryButton: { background: '#16224f', color: '#fff', border: 0, borderRadius: 16, padding: '14px 18px', fontSize: 18 },
  list: { display: 'grid', gap: 10, marginTop: 14 },
  purchaseRow: {
    display: 'grid', gridTemplateColumns: '1.5fr .8fr .6fr auto', gap: 12, alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid rgba(129,140,248,.12)'
  },
  purchaseTitle: { fontSize: 18, fontWeight: 700 },
  purchaseMeta: { color: '#b7c0e5', marginTop: 4 },
  purchaseAmount: { fontSize: 18, fontWeight: 700 },
  purchaseInstallment: { color: '#d6dcff' },
  ghostButton: { background: '#16224f', color: '#fff', border: '1px solid rgba(129,140,248,.18)', borderRadius: 14, padding: '12px 16px', fontWeight: 700 },
};

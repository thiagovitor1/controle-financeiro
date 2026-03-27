"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function moeda(v) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));
}

function formatMonthKey(dateString) {
  const date = new Date(dateString + "T12:00:00");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${month}/${date.getFullYear()}`;
}

function parcelasTexto(atual, total) {
  if (!total || total <= 1) return "à vista";
  return `${atual} de ${total}`;
}

const mesesNomes = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
  "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
  "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
};

function monthLabel(key) {
  const [m, y] = String(key || "").split("/");
  if (!m || !y) return key || "";
  return `${mesesNomes[m] || m}/${y}`;
}

function IconBtn({ children, onClick }) {
  return <button className="iconBtn" onClick={onClick} type="button">{children}</button>;
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="title">{title}</div>
          <button className="closeBtn" onClick={onClose} type="button">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MonthDropdown({ value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="monthDropdown">
      <button className="monthTrigger" onClick={() => setOpen(!open)} type="button">
        <span>{monthLabel(value)}</span>
        <span className={`arrow ${open ? "up" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="monthMenu">
          {options.map((item) => (
            <button
              key={item}
              className={`monthItem ${item === value ? "active" : ""}`}
              onClick={() => { onSelect(item); setOpen(false); }}
              type="button"
            >
              {monthLabel(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CompraItem({ purchase, onAdvance, onDelete }) {
  return (
    <div className="purchaseCard">
      <div>
        <div className="purchaseTitle">{purchase.description}</div>
        <div className="purchaseSub">{purchase.purchase_date} • {purchase.category}</div>
      </div>
      <div className="purchaseFooter">
        <div>
          <div className="purchaseValue">{moeda(purchase.amount)}</div>
          <div className="purchaseSub">{parcelasTexto(purchase.installment_current, purchase.installments_total)}</div>
        </div>
        <div className="actionRow">
          <button className="miniBtn" onClick={() => onAdvance(purchase)} type="button">Antecipar</button>
          <button className="dangerBtn" onClick={() => onDelete(purchase.id)} type="button">Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [invoiceMonth, setInvoiceMonth] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const [cardForm, setCardForm] = useState({ name: "", limit_amount: "", closing_day: "", due_day: "" });
  const [purchaseForm, setPurchaseForm] = useState({
    description: "", category: "", purchase_date: "", amount: "", installments_total: "1", invoice_month: ""
  });

  async function loadData() {
    setLoading(true);
    setMessage("");

    const { data: cardsData, error: cardsError } = await supabase.from("cards").select("*").order("name");
    if (cardsError) {
      setMessage("Erro ao carregar cartões. Rode o SQL no Supabase.");
      setLoading(false);
      return;
    }

    let purchasesData = [];
    if ((cardsData || []).length) {
      const ids = cardsData.map((c) => c.id);
      const { data, error } = await supabase.from("purchases").select("*").in("card_id", ids).order("purchase_date", { ascending: false });
      if (!error) purchasesData = data || [];
    }

    const merged = (cardsData || []).map((card) => ({
      ...card,
      purchases: purchasesData.filter((p) => p.card_id === card.id),
    }));

    setCards(merged);

    if (merged.length) {
      const selected = merged.find((c) => c.id === selectedCardId) || merged[0];
      setSelectedCardId(selected.id);
      const invoiceKeys = [...new Set(selected.purchases.map((p) => p.invoice_month).filter(Boolean))].sort().reverse();
      const fallback = `${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear()}`;
      setInvoiceMonth((curr) => invoiceKeys.includes(curr) ? curr : (invoiceKeys[0] || fallback));
    } else {
      setSelectedCardId("");
      setInvoiceMonth("");
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const selectedCard = useMemo(
    () => cards.find((c) => c.id === selectedCardId) || null,
    [cards, selectedCardId]
  );

  const availableInvoiceMonths = useMemo(() => {
    if (!selectedCard) return [];
    return [...new Set(selectedCard.purchases.map((p) => p.invoice_month).filter(Boolean))].sort().reverse();
  }, [selectedCard]);

  const filteredPurchases = useMemo(() => {
    if (!selectedCard) return [];
    return selectedCard.purchases.filter((p) => {
      const okMonth = invoiceMonth ? p.invoice_month === invoiceMonth : true;
      const okSearch = p.description.toLowerCase().includes(search.toLowerCase());
      return okMonth && okSearch;
    });
  }, [selectedCard, invoiceMonth, search]);

  const invoiceTotal = filteredPurchases.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  function openNewCardModal() {
    setEditingCard(null);
    setCardForm({ name: "", limit_amount: "", closing_day: "", due_day: "" });
    setCardModalOpen(true);
  }

  function openEditCardModal() {
    if (!selectedCard) return;
    setEditingCard(selectedCard);
    setCardForm({
      name: selectedCard.name || "",
      limit_amount: String(selectedCard.limit_amount || ""),
      closing_day: String(selectedCard.closing_day || ""),
      due_day: String(selectedCard.due_day || ""),
    });
    setCardModalOpen(true);
  }

  function openPurchaseModal() {
    if (!selectedCard) return;
    setPurchaseForm({
      description: "", category: "", purchase_date: "", amount: "",
      installments_total: "1", invoice_month: invoiceMonth || ""
    });
    setPurchaseModalOpen(true);
  }

  async function saveCard(e) {
    e.preventDefault();
    const payload = {
      name: cardForm.name.trim(),
      limit_amount: Number(cardForm.limit_amount || 0),
      closing_day: Number(cardForm.closing_day || 0),
      due_day: Number(cardForm.due_day || 0),
    };
    if (!payload.name) {
      setMessage("Informe o nome do cartão.");
      return;
    }
    if (editingCard) {
      const { error } = await supabase.from("cards").update(payload).eq("id", editingCard.id);
      if (error) return setMessage("Erro ao atualizar cartão.");
      setMessage("Cartão atualizado com sucesso.");
    } else {
      const { error } = await supabase.from("cards").insert(payload);
      if (error) return setMessage("Erro ao cadastrar cartão.");
      setMessage("Cartão cadastrado com sucesso.");
    }
    setCardModalOpen(false);
    await loadData();
  }

  async function savePurchase(e) {
    e.preventDefault();
    if (!selectedCard) return;
    const date = purchaseForm.purchase_date || new Date().toISOString().slice(0, 10);
    const invoiceKey = purchaseForm.invoice_month || formatMonthKey(date);
    const payload = {
      card_id: selectedCard.id,
      description: purchaseForm.description.trim(),
      category: purchaseForm.category.trim() || "Geral",
      purchase_date: date,
      amount: Number(purchaseForm.amount || 0),
      installments_total: Number(purchaseForm.installments_total || 1),
      installment_current: 1,
      invoice_month: invoiceKey,
    };
    if (!payload.description || !payload.amount) return setMessage("Preencha descrição e valor da compra.");
    const { error } = await supabase.from("purchases").insert(payload);
    if (error) return setMessage("Erro ao cadastrar compra.");
    setPurchaseModalOpen(false);
    setInvoiceMonth(invoiceKey);
    setMessage("Compra cadastrada com sucesso.");
    await loadData();
  }

  async function deletePurchase(id) {
    if (!window.confirm("Deseja excluir esta compra?")) return;
    const { error } = await supabase.from("purchases").delete().eq("id", id);
    if (error) return setMessage("Erro ao excluir compra.");
    setMessage("Compra excluída.");
    await loadData();
  }

  async function advanceInstallment(purchase) {
    if ((purchase.installments_total || 1) <= 1) return setMessage("Essa compra não tem parcelas.");
    const next = Number(purchase.installment_current || 1) + 1;
    if (next > Number(purchase.installments_total)) return setMessage("Todas as parcelas já foram antecipadas.");
    const { error } = await supabase.from("purchases").update({ installment_current: next }).eq("id", purchase.id);
    if (error) return setMessage("Erro ao antecipar parcela.");
    setMessage("Parcela antecipada com sucesso.");
    await loadData();
  }

  function trocarCartao(id) {
    const novo = cards.find((c) => c.id === id) || cards.find((c) => c.id === selectedCardId) || cards[0];
    setSelectedCardId(id);
    const keys = [...new Set((novo?.purchases || []).map((p) => p.invoice_month).filter(Boolean))].sort().reverse();
    setInvoiceMonth(keys[0] || invoiceMonth);
    setSearch("");
  }

  return (
    <main className="pageRoot">
      <style jsx global>{`
        *{box-sizing:border-box} html,body{margin:0;padding:0;background:radial-gradient(circle at top,#2a1458 0%,#170c36 38%,#0d0820 100%);color:#f7f5ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-x:hidden}
        .pageRoot{min-height:100vh;padding:12px 12px 24px}.container{max-width:760px;margin:0 auto;display:grid;gap:14px}
        .topBar{min-height:40px;border-radius:18px;display:flex;align-items:center;justify-content:center;color:rgba(245,240,255,.9);font-size:13px;font-weight:700;letter-spacing:.02em;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(10px)}
        .card{background:linear-gradient(180deg,rgba(31,17,66,.92) 0%,rgba(21,12,46,.96) 100%);border:1px solid rgba(255,255,255,.06);border-radius:24px;padding:16px;box-shadow:0 12px 30px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.03)}
        .rowBetween,.heroHead{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.title{font-size:15px;font-weight:700;color:rgba(248,245,255,.96)}.muted{color:rgba(224,216,245,.66);font-size:12px}
        .iconBtn,.closeBtn{width:32px;height:32px;min-width:32px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.06);color:#fff;font-size:16px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(0,0,0,.14)}
        .select,.input{width:100%;background:rgba(8,5,24,.9);color:#fff;border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:13px 14px;font-size:14px;outline:none}.select{margin-top:10px}
        .heroName{margin:0 0 6px 0;font-size:24px;font-weight:800;letter-spacing:-.04em;line-height:1}.invoiceWrap{margin-top:16px;padding:14px;border-radius:20px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)}
        .invoiceLabel,.statLabel{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:rgba(224,216,245,.6);margin-bottom:4px}.invoiceValue{font-size:22px;font-weight:800;line-height:1.1}
        .stats,.purchaseList,.formGrid{display:grid;gap:10px;margin-top:12px}.statBox,.purchaseCard{border-radius:18px;padding:12px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05)} .statValue{font-size:17px;font-weight:800;line-height:1.1}
        .sectionHeader{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:8px;margin-bottom:10px}.monthDropdown{position:relative;width:118px}.monthTrigger{width:100%;height:38px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(248,245,255,.94);font-size:12px;font-weight:600;padding:0 12px;display:flex;align-items:center;justify-content:space-between;gap:8px}
        .arrow{font-size:12px;opacity:.8;transform:translateY(-1px)}.arrow.up{transform:rotate(180deg) translateY(1px)}.monthMenu{position:absolute;top:calc(100% + 6px);right:0;width:150px;padding:6px;border-radius:16px;background:rgba(21,12,46,.96);border:1px solid rgba(255,255,255,.08);box-shadow:0 16px 28px rgba(0,0,0,.25);z-index:20;backdrop-filter:blur(12px)}
        .monthItem{width:100%;border:0;background:transparent;color:rgba(248,245,255,.92);text-align:left;padding:10px 12px;border-radius:12px;font-size:12px;font-weight:600}.monthItem.active{background:rgba(130,92,255,.18)}
        .purchaseTitle{font-size:15px;font-weight:700;margin-bottom:4px}.purchaseSub{font-size:12px;color:rgba(224,216,245,.64);line-height:1.4}.purchaseFooter{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}.purchaseValue{font-size:16px;font-weight:800}
        .miniBtn,.dangerBtn,.primaryBtn{background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:9px 12px;font-size:12px;font-weight:700}.dangerBtn{background:rgba(255,95,95,.12);border-color:rgba(255,95,95,.18)}.primaryBtn{background:rgba(130,92,255,.22);border-color:rgba(130,92,255,.2)}
        .actionRow{display:flex;gap:8px;flex-wrap:wrap}.faturaResumo,.message,.loading{font-size:12px;color:rgba(224,216,245,.75)}.message{padding:12px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04)}.loading{text-align:center;padding:30px 16px}
        .bottomNav{position:sticky;bottom:10px;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:8px;border-radius:20px;background:rgba(12,8,28,.88);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(12px);box-shadow:0 16px 34px rgba(0,0,0,.22)}
        .navItem{text-align:center;color:rgba(242,239,255,.82);font-weight:700;font-size:12px;padding:10px 4px;border-radius:14px}.navItem.active{background:rgba(130,92,255,.18)}
        .modalBackdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:14px;z-index:50}.modalCard{width:100%;max-width:520px;background:linear-gradient(180deg,rgba(31,17,66,.98) 0%,rgba(21,12,46,.99) 100%);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:16px}.modalHeader{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}
      `}</style>

      <div className="container">
        <div className="topBar">Cartão</div>
        {message ? <div className="message">{message}</div> : null}

        <section className="card">
          <div className="rowBetween" style={{alignItems:"center"}}>
            <div className="title">Cartão selecionado</div>
            <IconBtn onClick={openNewCardModal}>+</IconBtn>
          </div>
          <select className="select" value={selectedCardId} onChange={(e) => trocarCartao(e.target.value)}>
            {cards.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </section>

        {loading ? (
          <div className="card loading">Carregando cartões e compras...</div>
        ) : !selectedCard ? (
          <div className="card loading">Nenhum cartão cadastrado ainda.</div>
        ) : (
          <>
            <section className="card">
              <div className="heroHead">
                <div>
                  <h1 className="heroName">{selectedCard.name}</h1>
                  <div className="muted">Fecha dia {selectedCard.closing_day} • Vence dia {selectedCard.due_day}</div>
                </div>
                <IconBtn onClick={openEditCardModal}>✎</IconBtn>
              </div>

              <div className="invoiceWrap">
                <div className="invoiceLabel">Fatura atual</div>
                <div className="invoiceValue">{moeda(invoiceTotal)}</div>
              </div>

              <div className="stats">
                <div className="statBox"><div className="statLabel">Limite total</div><div className="statValue">{moeda(selectedCard.limit_amount)}</div></div>
                <div className="statBox"><div className="statLabel">Fechamento</div><div className="statValue">{selectedCard.closing_day}</div></div>
                <div className="statBox"><div className="statLabel">Vencimento</div><div className="statValue">{selectedCard.due_day}</div></div>
              </div>
            </section>

            <section className="card">
              <div className="sectionHeader">
                <div className="title">Compras</div>
                <MonthDropdown value={invoiceMonth} options={availableInvoiceMonths.length ? availableInvoiceMonths : [invoiceMonth]} onSelect={setInvoiceMonth} />
                <IconBtn onClick={openPurchaseModal}>+</IconBtn>
              </div>

              <input className="input" placeholder="Buscar compra" value={search} onChange={(e) => setSearch(e.target.value)} />
              <div className="faturaResumo">Fatura filtrada: <strong>{monthLabel(invoiceMonth)}</strong> • Total: <strong>{moeda(invoiceTotal)}</strong></div>

              <div className="purchaseList">
                {filteredPurchases.map((purchase) => (
                  <CompraItem key={purchase.id} purchase={purchase} onAdvance={advanceInstallment} onDelete={deletePurchase} />
                ))}
                {!filteredPurchases.length ? <div className="purchaseSub">Nenhuma compra encontrada para essa fatura.</div> : null}
              </div>
            </section>
          </>
        )}

        <div className="bottomNav">
          <div className="navItem">Início</div><div className="navItem">Contas</div><div className="navItem">Lançar</div><div className="navItem active">Cartões</div><div className="navItem">Mais</div>
        </div>
      </div>

      <Modal open={cardModalOpen} title={editingCard ? "Editar cartão" : "Novo cartão"} onClose={() => setCardModalOpen(false)}>
        <form className="formGrid" onSubmit={saveCard}>
          <input className="input" placeholder="Nome do cartão" value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} />
          <input className="input" placeholder="Limite" type="number" value={cardForm.limit_amount} onChange={(e) => setCardForm({ ...cardForm, limit_amount: e.target.value })} />
          <input className="input" placeholder="Fechamento" type="number" value={cardForm.closing_day} onChange={(e) => setCardForm({ ...cardForm, closing_day: e.target.value })} />
          <input className="input" placeholder="Vencimento" type="number" value={cardForm.due_day} onChange={(e) => setCardForm({ ...cardForm, due_day: e.target.value })} />
          <button className="primaryBtn" type="submit">{editingCard ? "Salvar alterações" : "Cadastrar cartão"}</button>
        </form>
      </Modal>

      <Modal open={purchaseModalOpen} title="Nova compra" onClose={() => setPurchaseModalOpen(false)}>
        <form className="formGrid" onSubmit={savePurchase}>
          <input className="input" placeholder="Descrição da compra" value={purchaseForm.description} onChange={(e) => setPurchaseForm({ ...purchaseForm, description: e.target.value })} />
          <input className="input" placeholder="Categoria" value={purchaseForm.category} onChange={(e) => setPurchaseForm({ ...purchaseForm, category: e.target.value })} />
          <input className="input" type="date" value={purchaseForm.purchase_date} onChange={(e) => setPurchaseForm({ ...purchaseForm, purchase_date: e.target.value })} />
          <input className="input" placeholder="Valor" type="number" value={purchaseForm.amount} onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value })} />
          <input className="input" placeholder="Número de parcelas" type="number" value={purchaseForm.installments_total} onChange={(e) => setPurchaseForm({ ...purchaseForm, installments_total: e.target.value })} />
          <input className="input" placeholder="Mês da fatura (MM/AAAA)" value={purchaseForm.invoice_month} onChange={(e) => setPurchaseForm({ ...purchaseForm, invoice_month: e.target.value })} />
          <button className="primaryBtn" type="submit">Cadastrar compra</button>
        </form>
      </Modal>
    </main>
  );
}

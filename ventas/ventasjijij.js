import { useState, useRef, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: "7702001001", name: "Arroz Diana 500g", price: 3200, stock: 48, category: "Granos" },
  { id: "7702001002", name: "Aceite Girasol 1L", price: 8900, stock: 24, category: "Aceites" },
  { id: "7702001003", name: "Leche Alpina 1L", price: 4500, stock: 36, category: "Lácteos" },
  { id: "7702001004", name: "Panela 500g", price: 2800, stock: 60, category: "Endulzantes" },
  { id: "7702001005", name: "Jabón Rey 300g", price: 3600, stock: 20, category: "Aseo" },
  { id: "7702001006", name: "Café Sello Rojo 250g", price: 11500, stock: 15, category: "Bebidas" },
  { id: "7702001007", name: "Azúcar Riopaila 1kg", price: 4200, stock: 40, category: "Endulzantes" },
  { id: "7702001008", name: "Harina Selecta 1kg", price: 3800, stock: 30, category: "Granos" },
  { id: "7702001009", name: "Sal Marina 500g", price: 1500, stock: 55, category: "Condimentos" },
  { id: "7702001010", name: "Atún Van Camps 170g", price: 5200, stock: 18, category: "Enlatados" },
  { id: "7702001011", name: "Gaseosa Postobón 1.5L", price: 5800, stock: 22, category: "Bebidas" },
  { id: "7702001012", name: "Galletas Festival 180g", price: 3100, stock: 28, category: "Snacks" },
];

const generateSaleId = () => `VTA-${Date.now().toString().slice(-6)}`;
const formatCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    scan: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    pause: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    cancel: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    cash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
    transfer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m10-2h3a2 2 0 0 0 2-2v-3"/><path d="m7 13 3 3 7-7"/></svg>,
    credit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3H1v13h15V3zM7 16v2m10-5v5M21 8h-4v8h4V8z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    receipt: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 2v20l3-1.5L10 22l3-1.5L16 22l3-1.5L22 22V2l-3 1.5L16 2l-3 1.5L10 2 7 3.5 4 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><triangle points="10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    store: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  };
  return icons[name] || null;
};

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: t.type === "error" ? "#ef4444" : t.type === "warning" ? "#f59e0b" : "#10b981",
          color: "#fff", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 300,
          animation: "slideIn 0.2s ease",
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function POSSystem() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null); // 'cash'|'transfer'|'credit'
  const [cashInput, setCashInput] = useState("");
  const [creditClient, setCreditClient] = useState("");
  const [pausedSales, setPausedSales] = useState([]);
  const [completedSales, setCompletedSales] = useState([]);
  const [view, setView] = useState("pos"); // 'pos'|'history'
  const [modal, setModal] = useState(null); // 'payment'|'pause'|'cancel'|'cancelDone'|'success'
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [toasts, setToasts] = useState([]);
  const [currentSaleId] = useState(generateSaleId);
  const barcodeRef = useRef();

  const toast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const addToCart = (product) => {
    if (product.stock <= 0) { toast("Producto sin stock", "error"); return; }
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) { toast("Stock insuficiente", "warning"); return; }
      setCart((c) => c.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart((c) => [...c, { ...product, qty: 1 }]);
    }
    toast(`${product.name} agregado`, "success");
  };

  const updateQty = (id, delta) => {
    setCart((c) => c.map((i) => {
      if (i.id !== id) return i;
      const newQty = i.qty + delta;
      if (newQty <= 0) return null;
      const prod = products.find((p) => p.id === id);
      if (newQty > prod.stock) { toast("Stock insuficiente", "warning"); return i; }
      return { ...i, qty: newQty };
    }).filter(Boolean));
  };

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Barcode scan ──────────────────────────────────────────────────────────
  const handleBarcodeScan = (e) => {
    if (e.key === "Enter") {
      const prod = products.find((p) => p.id === barcode.trim());
      if (prod) addToCart(prod);
      else toast("Código no encontrado", "error");
      setBarcode("");
    }
  };

  // ── Payment / Checkout ────────────────────────────────────────────────────
  const confirmPayment = () => {
    if (!paymentMethod) { toast("Selecciona método de pago", "warning"); return; }
    if (paymentMethod === "cash" && parseFloat(cashInput.replace(/\./g, "")) < cartTotal) {
      toast("Efectivo insuficiente", "error"); return;
    }
    if (paymentMethod === "credit" && !creditClient.trim()) {
      toast("Ingresa nombre del cliente", "warning"); return;
    }
    // Discount stock
    setProducts((prods) =>
      prods.map((p) => {
        const item = cart.find((c) => c.id === p.id);
        return item ? { ...p, stock: p.stock - item.qty } : p;
      })
    );
    const sale = {
      id: currentSaleId,
      date: new Date(),
      items: [...cart],
      total: cartTotal,
      method: paymentMethod,
      client: paymentMethod === "credit" ? creditClient : null,
      cashPaid: paymentMethod === "cash" ? parseFloat(cashInput.replace(/\./g, "")) : null,
      status: "completed",
    };
    setCompletedSales((s) => [sale, ...s]);
    setCart([]);
    setPaymentMethod(null);
    setCashInput("");
    setCreditClient("");
    setModal("success");
    toast("¡Venta registrada exitosamente!", "success");
  };

  // ── Pause sale ────────────────────────────────────────────────────────────
  const pauseSale = () => {
    if (cart.length === 0) { toast("El carrito está vacío", "warning"); return; }
    setPausedSales((p) => [...p, { id: generateSaleId(), cart: [...cart], savedAt: new Date() }]);
    setCart([]);
    setModal(null);
    toast("Venta pausada correctamente");
  };

  const resumeSale = (paused) => {
    if (cart.length > 0) { toast("Termina la venta actual primero", "warning"); return; }
    setCart(paused.cart);
    setPausedSales((p) => p.filter((s) => s.id !== paused.id));
    toast("Venta recuperada");
  };

  // ── Cancel sale ───────────────────────────────────────────────────────────
  const initCancelSale = (sale) => { setCancelTarget(sale); setCancelReason(""); setModal("cancel"); };

  const confirmCancelSale = () => {
    if (!cancelReason.trim()) { toast("Ingresa el motivo de cancelación", "warning"); return; }
    // Restore stock
    setProducts((prods) =>
      prods.map((p) => {
        const item = cancelTarget.items.find((c) => c.id === p.id);
        return item ? { ...p, stock: p.stock + item.qty } : p;
      })
    );
    setCompletedSales((s) =>
      s.map((sale) => sale.id === cancelTarget.id
        ? { ...sale, status: "cancelled", cancelReason, cancelDate: new Date() }
        : sale)
    );
    setModal("cancelDone");
    toast("Venta cancelada y stock repuesto");
  };

  // ── Filtered products ─────────────────────────────────────────────────────
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.includes(search)
  );

  // ── Change calculation ────────────────────────────────────────────────────
  const cashPaid = parseFloat(cashInput.replace(/\./g, "")) || 0;
  const change = cashPaid - cartTotal;

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", background: "#0f1117", minHeight: "100vh", color: "#e8e6e1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1a1d27; } ::-webkit-scrollbar-thumb { background: #3a3f5c; border-radius: 3px; }
        input, button { font-family: inherit; }
        button { cursor: pointer; border: none; }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.6;} }
        .btn-primary { background: #4ade80; color: #0a0f1e; padding: 10px 18px; border-radius: 6px; font-weight: 700; font-size: 13px; transition: all 0.15s; letter-spacing: 0.5px; }
        .btn-primary:hover { background: #22c55e; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(74,222,128,0.3); }
        .btn-primary:disabled { background: #2a2f3e; color: #555; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-danger { background: #ef4444; color: #fff; padding: 10px 18px; border-radius: 6px; font-weight: 700; font-size: 13px; transition: all 0.15s; }
        .btn-danger:hover { background: #dc2626; }
        .btn-ghost { background: transparent; color: #9ca3af; padding: 8px 14px; border-radius: 6px; font-size: 13px; transition: all 0.15s; border: 1px solid #2a2f3e; }
        .btn-ghost:hover { background: #1e2233; color: #e8e6e1; }
        .card { background: #161b29; border: 1px solid #252b3d; border-radius: 10px; }
        .input-field { background: #1a1f30; border: 1px solid #2a3048; border-radius: 6px; color: #e8e6e1; padding: 9px 12px; font-size: 13px; width: 100%; transition: border-color 0.15s; }
        .input-field:focus { outline: none; border-color: #4ade80; }
        .input-field::placeholder { color: #4a5068; }
        .overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.15s; }
        .modal { background:#161b29;border:1px solid #252b3d;border-radius:12px;padding:28px;width:90%;max-width:440px;animation:fadeIn 0.2s; }
        .tag { display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:0.5px; }
        .method-btn { padding:14px;border-radius:8px;border:2px solid #2a2f3e;background:#1a1f30;color:#9ca3af;transition:all 0.15s;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;font-weight:600;letter-spacing:0.5px;cursor:pointer; }
        .method-btn.active { border-color:#4ade80;background:#0f1f18;color:#4ade80; }
        .method-btn:hover:not(.active) { border-color:#4a5068;background:#1e2233; }
      `}</style>

      <Toast toasts={toasts} />

      {/* ── Header ── */}
      <header style={{ background: "#0d1020", borderBottom: "1px solid #1e2438", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#4ade80", borderRadius: 8, padding: "6px 8px", display: "flex" }}><Icon name="store" size={18} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#e8e6e1", letterSpacing: 1 }}>TIENDA POS</div>
            <div style={{ fontSize: 11, color: "#4a5068" }}>{new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" onClick={() => setView("pos")} style={{ borderColor: view === "pos" ? "#4ade80" : undefined, color: view === "pos" ? "#4ade80" : undefined }}>
            <Icon name="receipt" size={14} /> <span style={{ marginLeft: 6 }}>POS</span>
          </button>
          <button className="btn-ghost" onClick={() => setView("history")} style={{ borderColor: view === "history" ? "#4ade80" : undefined, color: view === "history" ? "#4ade80" : undefined }}>
            <Icon name="history" size={14} /> <span style={{ marginLeft: 6 }}>Historial</span>
          </button>
        </div>
      </header>

      {view === "pos" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 0, height: "calc(100vh - 57px)" }}>

          {/* ── Left: Products ── */}
          <div style={{ overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Search + Barcode */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#4a5068" }}><Icon name="search" /></div>
                <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#4a5068" }}><Icon name="scan" /></div>
                <input ref={barcodeRef} className="input-field" style={{ paddingLeft: 36 }} placeholder="Escanear código de barras..." value={barcode} onChange={(e) => setBarcode(e.target.value)} onKeyDown={handleBarcodeScan} />
              </div>
            </div>

            {/* Paused sales banner */}
            {pausedSales.length > 0 && (
              <div style={{ background: "#1c1a0a", border: "1px solid #f59e0b", borderRadius: 8, padding: "10px 16px" }}>
                <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⏸ VENTAS PAUSADAS ({pausedSales.length})</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {pausedSales.map((ps) => (
                    <button key={ps.id} onClick={() => resumeSale(ps)} style={{ background: "#2a200a", border: "1px solid #f59e0b", color: "#f59e0b", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="play" size={12} /> {ps.id} — {ps.cart.length} items
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {filtered.map((p) => (
                <button key={p.id} onClick={() => addToCart(p)} style={{
                  background: p.stock === 0 ? "#111318" : "#161b29",
                  border: `1px solid ${p.stock === 0 ? "#1a1d27" : "#252b3d"}`,
                  borderRadius: 8, padding: "14px", textAlign: "left", cursor: p.stock === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.15s", opacity: p.stock === 0 ? 0.5 : 1,
                }} onMouseEnter={(e) => { if (p.stock > 0) e.currentTarget.style.borderColor = "#4ade80"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = p.stock === 0 ? "#1a1d27" : "#252b3d"; }}>
                  <div style={{ fontSize: 10, color: "#4a5068", marginBottom: 4, letterSpacing: 1 }}>{p.category.toUpperCase()}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e6e1", marginBottom: 8, lineHeight: 1.3, fontFamily: "'IBM Plex Sans', sans-serif" }}>{p.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#4ade80" }}>{formatCOP(p.price)}</div>
                  <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: p.stock <= 5 ? "#f59e0b" : "#4a5068" }}>
                      {p.stock <= 5 ? `⚠ ${p.stock} uds` : `${p.stock} uds`}
                    </span>
                    <span style={{ fontSize: 10, color: "#2a3048", fontFamily: "monospace" }}>{p.id.slice(-4)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Cart ── */}
          <div className="card" style={{ borderRadius: 0, borderTop: "none", borderRight: "none", borderBottom: "none", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2438", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "#4a5068", letterSpacing: 1 }}>VENTA ACTUAL</div>
                <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>{currentSaleId}</div>
              </div>
              <span style={{ background: "#0f1f18", color: "#4ade80", border: "1px solid #1a3d28", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{cartCount} items</span>
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", color: "#2a3048", marginTop: 60 }}>
                  <Icon name="receipt" size={40} />
                  <div style={{ marginTop: 12, fontSize: 13 }}>Carrito vacío</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>Agrega productos para comenzar</div>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ background: "#1a1f30", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, border: "1px solid #252b3d" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e8e6e1", fontFamily: "'IBM Plex Sans', sans-serif", flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{item.name}</div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#4a5068", cursor: "pointer", padding: "0 2px", flexShrink: 0 }}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ background: "#252b3d", border: "none", color: "#9ca3af", width: 24, height: 24, borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="minus" size={12} /></button>
                        <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ background: "#252b3d", border: "none", color: "#9ca3af", width: 24, height: 24, borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={12} /></button>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80" }}>{formatCOP(item.price * item.qty)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total + Actions */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #1e2438" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: "#9ca3af", letterSpacing: 0.5 }}>TOTAL</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#4ade80", letterSpacing: -0.5 }}>{formatCOP(cartTotal)}</span>
              </div>

              <button className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: 14, marginBottom: 8 }}
                disabled={cart.length === 0} onClick={() => setModal("payment")}>
                Cobrar
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="btn-ghost" onClick={() => setModal("pause")} disabled={cart.length === 0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12 }}>
                  <Icon name="pause" size={13} /> Pausar
                </button>
                <button className="btn-ghost" onClick={() => setCart([])} disabled={cart.length === 0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#ef4444", borderColor: "#2a1a1a" }}>
                  <Icon name="cancel" size={13} /> Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

      ) : (
        /* ── History View ── */
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#4ade80", letterSpacing: 1 }}>HISTORIAL DE VENTAS</h2>
          {completedSales.length === 0 ? (
            <div style={{ textAlign: "center", color: "#2a3048", marginTop: 80 }}><Icon name="history" size={48} /><div style={{ marginTop: 16 }}>Sin ventas registradas</div></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {completedSales.map((sale) => (
                <div key={sale.id} className="card" style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 700, color: "#e8e6e1" }}>{sale.id}</span>
                        <span className="tag" style={{ background: sale.status === "cancelled" ? "#2a0f0f" : "#0f1f18", color: sale.status === "cancelled" ? "#ef4444" : "#4ade80", border: `1px solid ${sale.status === "cancelled" ? "#4a1a1a" : "#1a3d28"}` }}>
                          {sale.status === "cancelled" ? "CANCELADA" : "COMPLETADA"}
                        </span>
                        <span className="tag" style={{ background: "#1a1f30", color: "#9ca3af", border: "1px solid #252b3d" }}>
                          {sale.method === "cash" ? "EFECTIVO" : sale.method === "transfer" ? "TRANSFERENCIA" : "CRÉDITO"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "#4a5068", marginTop: 4 }}>
                        {sale.date.toLocaleString("es-CO")}
                        {sale.client && <span style={{ marginLeft: 12, color: "#f59e0b" }}>👤 {sale.client}</span>}
                      </div>
                      {sale.status === "cancelled" && (
                        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Motivo: {sale.cancelReason}</div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: sale.status === "cancelled" ? "#4a5068" : "#4ade80", textDecoration: sale.status === "cancelled" ? "line-through" : "none" }}>{formatCOP(sale.total)}</div>
                      {sale.status === "completed" && (
                        <button className="btn-danger" style={{ marginTop: 8, padding: "6px 12px", fontSize: 11 }} onClick={() => initCancelSale(sale)}>
                          Cancelar venta
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sale.items.map((item) => (
                      <span key={item.id} style={{ background: "#1a1f30", border: "1px solid #252b3d", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#9ca3af" }}>
                        {item.name} ×{item.qty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Modal: Payment ── */}
      {modal === "payment" && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "#e8e6e1", letterSpacing: 0.5 }}>REGISTRAR PAGO</div>

            <div style={{ background: "#1a1f30", borderRadius: 8, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>Total a cobrar</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#4ade80" }}>{formatCOP(cartTotal)}</span>
            </div>

            <div style={{ fontSize: 11, color: "#4a5068", marginBottom: 10, letterSpacing: 1 }}>MÉTODO DE PAGO</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { id: "cash", label: "EFECTIVO", icon: "cash" },
                { id: "transfer", label: "NEQUI / DAVIPLATA", icon: "transfer" },
                { id: "credit", label: "FIAR", icon: "credit" },
              ].map((m) => (
                <button key={m.id} className={`method-btn ${paymentMethod === m.id ? "active" : ""}`} onClick={() => setPaymentMethod(m.id)}>
                  <Icon name={m.icon} size={22} />
                  <span style={{ fontSize: 10 }}>{m.label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "cash" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#4a5068", marginBottom: 6, letterSpacing: 1 }}>EFECTIVO RECIBIDO</div>
                <input className="input-field" type="text" placeholder="0" value={cashInput}
                  onChange={(e) => setCashInput(e.target.value.replace(/[^0-9.]/g, ""))} style={{ fontSize: 20, fontWeight: 700, textAlign: "right" }} />
                {cashPaid > 0 && (
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", background: change >= 0 ? "#0f1f18" : "#1f0f0f", border: `1px solid ${change >= 0 ? "#1a3d28" : "#3d1a1a"}`, borderRadius: 6, padding: "10px 14px" }}>
                    <span style={{ fontSize: 13, color: "#9ca3af" }}>Cambio</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: change >= 0 ? "#4ade80" : "#ef4444" }}>{formatCOP(Math.abs(change))}</span>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === "credit" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#4a5068", marginBottom: 6, letterSpacing: 1 }}>NOMBRE DEL CLIENTE</div>
                <input className="input-field" placeholder="Ej: Juan García" value={creditClient} onChange={(e) => setCreditClient(e.target.value)} />
                <div style={{ marginTop: 8, background: "#1c1a0a", border: "1px solid #f59e0b", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#f59e0b" }}>
                  ⚠ Esta venta quedará registrada como deuda pendiente del cliente.
                </div>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div style={{ marginBottom: 16, background: "#0a1020", border: "1px solid #1e3a6e", borderRadius: 6, padding: "12px 16px" }}>
                <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 600, marginBottom: 4 }}>PAGO DIGITAL</div>
                <div style={{ fontSize: 11, color: "#4a7aaa" }}>Confirma que el cliente realizó la transferencia antes de continuar.</div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={confirmPayment}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon name="check" size={15} /> Confirmar pago
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Pause ── */}
      {modal === "pause" && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="modal">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#e8e6e1" }}>PAUSAR VENTA</div>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20, lineHeight: 1.6 }}>
              La venta actual con <strong style={{ color: "#4ade80" }}>{cartCount} productos ({formatCOP(cartTotal)})</strong> será guardada. Podrás recuperarla cuando termines con el otro cliente.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={pauseSale}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon name="pause" size={14} /> Pausar venta
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Cancel Sale ── */}
      {modal === "cancel" && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) { setModal(null); setCancelTarget(null); } }}>
          <div className="modal">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "#ef4444" }}>CANCELAR VENTA</div>
            <div style={{ fontSize: 12, color: "#4a5068", marginBottom: 16 }}>{cancelTarget?.id} — {formatCOP(cancelTarget?.total)}</div>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16, lineHeight: 1.6 }}>
              Los productos serán devueltos al inventario. Esta acción no se puede deshacer.
            </p>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#4a5068", marginBottom: 6, letterSpacing: 1 }}>MOTIVO DE CANCELACIÓN *</div>
              <textarea className="input-field" rows={3} placeholder="Ej: Error en cobro, cliente desistió, producto dañado..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} style={{ resize: "none" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button className="btn-ghost" onClick={() => { setModal(null); setCancelTarget(null); }}>Volver</button>
              <button className="btn-danger" onClick={confirmCancelSale}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon name="cancel" size={14} /> Cancelar venta
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Success ── */}
      {modal === "success" && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, background: "#0f1f18", border: "2px solid #4ade80", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon name="check" size={28} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>¡VENTA EXITOSA!</div>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>La venta fue registrada y el inventario actualizado correctamente.</p>
            <button className="btn-primary" onClick={() => setModal(null)} style={{ width: "100%" }}>Nueva venta</button>
          </div>
        </div>
      )}

      {/* ── Modal: Cancel Done ── */}
      {modal === "cancelDone" && (
        <div className="overlay" onClick={() => { setModal(null); setCancelTarget(null); }}>
          <div className="modal" style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, background: "#1f0f0f", border: "2px solid #ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon name="cancel" size={28} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>VENTA CANCELADA</div>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Los productos han sido devueltos al stock correctamente.</p>
            <button className="btn-ghost" onClick={() => { setModal(null); setCancelTarget(null); }} style={{ width: "100%" }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

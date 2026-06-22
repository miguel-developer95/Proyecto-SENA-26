import { useState, useMemo } from "react";


// ── Datos iniciales de ejemplo ──────────────────────────────────────────────
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Arroz x 500g",  categoria: "Granos",      codigoBarras: "770100001", precioCompra: 1800,  precioVenta: 2500,  stock: 120, stockMinimo: 20 },
  { id: 2, nombre: "Aceite 1L",     categoria: "Aceites",     codigoBarras: "770100002", precioCompra: 8500,  precioVenta: 12000, stock: 15,  stockMinimo: 10 },
  { id: 3, nombre: "Sal x 500g",    categoria: "Condimentos", codigoBarras: "770100003", precioCompra: 1200,  precioVenta: 1800,  stock: 4,   stockMinimo: 10 },
  { id: 4, nombre: "Gaseosa 1.5L",  categoria: "Bebidas",     codigoBarras: "770100004", precioCompra: 2800,  precioVenta: 3700,  stock: 48,  stockMinimo: 12 },
  { id: 5, nombre: "Leche 900ml",   categoria: "Lácteos",     codigoBarras: "770100005", precioCompra: 3200,  precioVenta: 4200,  stock: 22,  stockMinimo: 8  },
  { id: 6, nombre: "Azúcar x 1kg",  categoria: "Granos",      codigoBarras: "770100006", precioCompra: 2900,  precioVenta: 3800,  stock: 9,   stockMinimo: 15 },
];

const CATEGORIAS = ["Granos", "Aceites", "Bebidas", "Lácteos", "Condimentos", "Aseo", "Otro"];

const FORM_VACIO = {
  nombre: "", categoria: "Granos", codigoBarras: "",
  precioCompra: "", precioVenta: "", stock: "", stockMinimo: "",
};

// ── Utilidades ───────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

function getEstado(stock, min) {
  if (stock === 0)    return { clase: "badge-danger",  texto: "Sin stock" };
  if (stock < min)    return { clase: "badge-warning", texto: "Bajo"      };
  return               { clase: "badge-success", texto: "Normal"    };
}

// ── Sub-componente: Modal ────────────────────────────────────────────────────
function Modal({ titulo, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 500, fontSize: 15 }}>{titulo}</span>
          <button className="btn" style={{ padding: "4px 8px" }} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function Inventario() {
  const [productos, setProductos]     = useState(PRODUCTOS_INICIALES);
  const [nextId, setNextId]           = useState(7);
  const [busqueda, setBusqueda]       = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [modalForm, setModalForm]     = useState(false);   // true = abierto
  const [modalDel, setModalDel]       = useState(null);    // id a eliminar
  const [editId, setEditId]           = useState(null);    // null = nuevo
  const [form, setForm]               = useState(FORM_VACIO);
  const [errores, setErrores]         = useState({});

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return productos.filter((p) => {
      const matchQ =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.codigoBarras.includes(q);
      const matchC = !filtroCategoria || p.categoria === filtroCategoria;
      return matchQ && matchC;
    });
  }, [productos, busqueda, filtroCategoria]);

  // ── Estadísticas ───────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:   productos.length,
    bajos:   productos.filter((p) => p.stock > 0 && p.stock < p.stockMinimo).length,
    sinStock: productos.filter((p) => p.stock === 0).length,
  }), [productos]);

  // ── Categorías únicas para el filtro ──────────────────────────────────────
  const categoriasActivas = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort(),
    [productos]
  );

  // ── Manejo del formulario ──────────────────────────────────────────────────
  const abrirNuevo = () => {
    setEditId(null);
    setForm(FORM_VACIO);
    setErrores({});
    setModalForm(true);
  };

  const abrirEditar = (p) => {
    setEditId(p.id);
    setForm({
      nombre:       p.nombre,
      categoria:    p.categoria,
      codigoBarras: p.codigoBarras,
      precioCompra: p.precioCompra,
      precioVenta:  p.precioVenta,
      stock:        p.stock,
      stockMinimo:  p.stockMinimo,
    });
    setErrores({});
    setModalForm(true);
  };

  const cerrarModal = () => {
    setModalForm(false);
    setEditId(null);
  };

  const cambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim())                      errs.nombre       = "El nombre es obligatorio.";
    if (!form.codigoBarras.trim())                errs.codigoBarras = "El código es obligatorio.";
    if (form.precioCompra === "" || Number(form.precioCompra) < 0) errs.precioCompra = "Precio inválido.";
    if (form.precioVenta  === "" || Number(form.precioVenta)  < 0) errs.precioVenta  = "Precio inválido.";
    if (form.stock        === "" || Number(form.stock)        < 0) errs.stock        = "Stock inválido.";
    if (form.stockMinimo  === "" || Number(form.stockMinimo)  < 0) errs.stockMinimo  = "Mínimo inválido.";
    return errs;
  };

  const guardar = () => {
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    const datos = {
      nombre:       form.nombre.trim(),
      categoria:    form.categoria,
      codigoBarras: form.codigoBarras.trim(),
      precioCompra: Number(form.precioCompra),
      precioVenta:  Number(form.precioVenta),
      stock:        Number(form.stock),
      stockMinimo:  Number(form.stockMinimo),
    };

    if (editId !== null) {
      // RF 1.2 — Modificar
      setProductos((prev) => prev.map((p) => (p.id === editId ? { ...p, ...datos } : p)));
    } else {
      // RF 1.1 — Registrar nuevo
      setProductos((prev) => [...prev, { id: nextId, ...datos }]);
      setNextId((n) => n + 1);
    }
    cerrarModal();
  };

  // RF 1.3 — Eliminar
  const confirmarEliminar = () => {
    setProductos((prev) => prev.filter((p) => p.id !== modalDel));
    setModalDel(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total productos</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Stock bajo</div>
          <div className="stat-value" style={{ color: "#854F0B" }}>{stats.bajos}</div>
          <div className="stat-change" style={{ color: "#854F0B" }}>Por reponer</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sin stock</div>
          <div className="stat-value" style={{ color: "#A32D2D" }}>{stats.sinStock}</div>
          <div className="stat-change" style={{ color: "#A32D2D" }}>Crítico</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categorías</div>
          <div className="stat-value">{categoriasActivas.length}</div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="card">
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o código…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: "100%", paddingLeft: 32 }}
            />
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#aaa" }}>🔍</span>
          </div>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categoriasActivas.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={abrirNuevo}>
            + Agregar producto
          </button>
        </div>

        {/* RF 1.4 — Listado de productos */}
        {productosFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa" }}>
            No se encontraron productos.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cód. Barras</th>
                  <th>Precio compra</th>
                  <th>Precio venta</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((p) => {
                  const { clase, texto } = getEstado(p.stock, p.stockMinimo);
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12, color: "#888" }}>{p.codigoBarras}</td>
                      <td>{fmt(p.precioCompra)}</td>
                      <td>{fmt(p.precioVenta)}</td>
                      <td><strong>{p.stock}</strong></td>
                      <td>{p.stockMinimo}</td>
                      <td><span className={`badge ${clase}`}>{texto}</span></td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          className="btn"
                          style={{ padding: "4px 9px", fontSize: 12, marginRight: 4 }}
                          onClick={() => abrirEditar(p)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn"
                          style={{ padding: "4px 9px", fontSize: 12, color: "#A32D2D", borderColor: "#f5c6c6" }}
                          onClick={() => setModalDel(p.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: Agregar / Editar (RF 1.1 y RF 1.2) ── */}
      {modalForm && (
        <Modal titulo={editId !== null ? "Editar producto" : "Agregar producto"} onClose={cerrarModal}>
          <div className="form-group">
            <label>Nombre del producto *</label>
            <input name="nombre" value={form.nombre} onChange={cambio} placeholder="Ej: Arroz x 500g" />
            {errores.nombre && <span style={{ fontSize: 11, color: "#A32D2D" }}>{errores.nombre}</span>}
          </div>

          <div className="form-grid" style={{ marginTop: 10 }}>
            <div className="form-group">
              <label>Categoría</label>
              <select name="categoria" value={form.categoria} onChange={cambio}>
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Código de barras *</label>
              <input name="codigoBarras" value={form.codigoBarras} onChange={cambio} placeholder="Ej: 7701234567890" />
              {errores.codigoBarras && <span style={{ fontSize: 11, color: "#A32D2D" }}>{errores.codigoBarras}</span>}
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 10 }}>
            <div className="form-group">
              <label>Precio de compra ($) *</label>
              <input name="precioCompra" type="number" min="0" value={form.precioCompra} onChange={cambio} placeholder="0" />
              {errores.precioCompra && <span style={{ fontSize: 11, color: "#A32D2D" }}>{errores.precioCompra}</span>}
            </div>
            <div className="form-group">
              <label>Precio de venta ($) *</label>
              <input name="precioVenta" type="number" min="0" value={form.precioVenta} onChange={cambio} placeholder="0" />
              {errores.precioVenta && <span style={{ fontSize: 11, color: "#A32D2D" }}>{errores.precioVenta}</span>}
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 10 }}>
            <div className="form-group">
              <label>Stock actual *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={cambio} placeholder="0" />
              {errores.stock && <span style={{ fontSize: 11, color: "#A32D2D" }}>{errores.stock}</span>}
            </div>
            <div className="form-group">
              <label>Stock mínimo *</label>
              <input name="stockMinimo" type="number" min="0" value={form.stockMinimo} onChange={cambio} placeholder="0" />
              {errores.stockMinimo && <span style={{ fontSize: 11, color: "#A32D2D" }}>{errores.stockMinimo}</span>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
            <button className="btn" onClick={cerrarModal}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardar}>
              {editId !== null ? "Guardar cambios" : "Agregar producto"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal: Confirmar eliminación (RF 1.3) ── */}
      {modalDel !== null && (
        <Modal titulo="Eliminar producto" onClose={() => setModalDel(null)}>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
            ¿Seguro que deseas eliminar{" "}
            <strong>{productos.find((p) => p.id === modalDel)?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn" onClick={() => setModalDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={confirmarEliminar}>
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
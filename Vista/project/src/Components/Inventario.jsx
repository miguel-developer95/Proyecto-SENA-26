import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import "./Inventario.css";

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Arroz x 500g",  categoria: "Granos",      codigoBarras: "770100001", precioCompra: 1800,  precioVenta: 2500,  stock: 120, stockMinimo: 20, descontinuado: false },
  { id: 2, nombre: "Aceite 1L",     categoria: "Aceites",     codigoBarras: "770100002", precioCompra: 8500,  precioVenta: 12000, stock: 15,  stockMinimo: 10, descontinuado: false },
  { id: 3, nombre: "Sal x 500g",    categoria: "Condimentos", codigoBarras: "770100003", precioCompra: 1200,  precioVenta: 1800,  stock: 4,   stockMinimo: 10, descontinuado: false },
  { id: 4, nombre: "Gaseosa 1.5L",  categoria: "Bebidas",     codigoBarras: "770100004", precioCompra: 2800,  precioVenta: 3700,  stock: 48,  stockMinimo: 12, descontinuado: false },
  { id: 5, nombre: "Leche 900ml",   categoria: "Lacteos",     codigoBarras: "770100005", precioCompra: 3200,  precioVenta: 4200,  stock: 22,  stockMinimo: 8,  descontinuado: false },
  { id: 6, nombre: "Azucar x 1kg",  categoria: "Granos",      codigoBarras: "770100006", precioCompra: 2900,  precioVenta: 3800,  stock: 9,   stockMinimo: 15, descontinuado: false },
];

const CATEGORIAS = ["Granos", "Aceites", "Bebidas", "Lacteos", "Condimentos", "Aseo", "Otro"];

const FORM_VACIO = {
  nombre: "", categoria: "Granos", codigoBarras: "",
  precioCompra: "", precioVenta: "", stock: "", stockMinimo: "",
};

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

function getEstado(stock, min) {
  if (stock === 0)     return { clase: "badge-canc",  texto: "Sin stock" };
  if (stock < min)     return { clase: "badge-pend",  texto: "Bajo"      };
  return                { clase: "badge-comp",  texto: "Normal"    };
}

function Modal({ titulo, onClose, children }) {
  return (
    <div className="inv-overlay" onClick={onClose}>
      <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-header">
          <span className="inv-modal-titulo">{titulo}</span>
          <button className="inv-modal-close" onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Inventario() {
  const { usuario } = useAuth();
  const [productos, setProductos]         = useState(PRODUCTOS_INICIALES);
  const [nextId, setNextId]               = useState(7);
  const [busqueda, setBusqueda]           = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [verDescontinuados, setVerDescontinuados] = useState(false);
  const [modalForm, setModalForm]         = useState(false);
  const [modalDescont, setModalDescont]   = useState(null);
  const [editId, setEditId]               = useState(null);
  const [form, setForm]                   = useState(FORM_VACIO);
  const [errores, setErrores]             = useState({});

  const activos = useMemo(() => productos.filter((p) => !p.descontinuado), [productos]);
  const descontinuados = useMemo(() => productos.filter((p) => p.descontinuado), [productos]);

  const alertasStock = useMemo(() =>
    activos.filter((p) => p.stock < p.stockMinimo),
    [activos]
  );

  const productosFiltrados = useMemo(() => {
    const base = verDescontinuados ? descontinuados : activos;
    const q = busqueda.toLowerCase();
    return base.filter((p) => {
      const matchQ = !q || p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q) || p.codigoBarras.includes(q);
      const matchC = !filtroCategoria || p.categoria === filtroCategoria;
      return matchQ && matchC;
    });
  }, [productos, busqueda, filtroCategoria, verDescontinuados, activos, descontinuados]);

  const stats = useMemo(() => ({
    total:    activos.length,
    bajos:    activos.filter((p) => p.stock > 0 && p.stock < p.stockMinimo).length,
    sinStock: activos.filter((p) => p.stock === 0).length,
    descont:  descontinuados.length,
  }), [activos, descontinuados]);

  const categoriasActivas = useMemo(
    () => [...new Set(activos.map((p) => p.categoria))].sort(),
    [activos]
  );

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

  const cerrarModal = () => { setModalForm(false); setEditId(null); };

  const cambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim())                                          errs.nombre       = "El nombre es obligatorio.";
    if (!form.codigoBarras.trim())                                    errs.codigoBarras = "El codigo es obligatorio.";
    if (form.precioCompra === "" || Number(form.precioCompra) < 0)   errs.precioCompra = "Precio invalido.";
    if (form.precioVenta  === "" || Number(form.precioVenta)  < 0)   errs.precioVenta  = "Precio invalido.";
    if (form.stock        === "" || Number(form.stock)        < 0)   errs.stock        = "Stock invalido.";
    if (form.stockMinimo  === "" || Number(form.stockMinimo)  < 0)   errs.stockMinimo  = "Minimo invalido.";
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
      setProductos((prev) => prev.map((p) => (p.id === editId ? { ...p, ...datos } : p)));
    } else {
      setProductos((prev) => [...prev, { id: nextId, ...datos, descontinuado: false }]);
      setNextId((n) => n + 1);
    }
    cerrarModal();
  };

  const descontinuar = () => {
    setProductos((prev) => prev.map((p) => p.id === modalDescont ? { ...p, descontinuado: true } : p));
    setModalDescont(null);
  };

  const reactivar = (id) => {
    setProductos((prev) => prev.map((p) => p.id === id ? { ...p, descontinuado: false } : p));
  };

  return (
    <div className="inv-page">
      <div className="inv-header">
        <div>
          <h1 className="inv-title">Inventario</h1>
          <p className="inv-sub">{usuario?.email}</p>
        </div>
        <button className="btn-nuevo" onClick={abrirNuevo}>+ Agregar producto</button>
      </div>

      {alertasStock.length > 0 && (
        <div className="alerta-stock">
          <span className="alerta-icono">!</span>
          <div>
            <p className="alerta-titulo">Alerta de stock bajo</p>
            <p className="alerta-lista">
              {alertasStock.map((p) => p.nombre).join(", ")} — requieren reposicion.
            </p>
          </div>
        </div>
      )}

      <div className="metric-grid">
        <div className="metric-card">
          <p className="metric-label">Total productos</p>
          <p className="metric-value">{stats.total}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Stock bajo</p>
          <p className="metric-value" style={{ color: "#854F0B" }}>{stats.bajos}</p>
          <p className="metric-sub">Por reponer</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Sin stock</p>
          <p className="metric-value" style={{ color: "#A32D2D" }}>{stats.sinStock}</p>
          <p className="metric-sub">Critico</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Descontinuados</p>
          <p className="metric-value" style={{ color: "#888" }}>{stats.descont}</p>
        </div>
      </div>

      <div className="inv-toolbar">
        <div className="inv-busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre, categoria o codigo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorias</option>
          {categoriasActivas.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button
          className={"btn-toggle" + (verDescontinuados ? " activo" : "")}
          onClick={() => setVerDescontinuados(!verDescontinuados)}
        >
          {verDescontinuados ? "Ver activos" : "Ver descontinuados"}
        </button>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="inv-vacio">No se encontraron productos.</div>
      ) : (
        <div className="inv-tabla-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Cod. Barras</th>
                <th>P. Compra</th>
                <th>P. Venta</th>
                <th>Stock</th>
                <th>Minimo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => {
                const { clase, texto } = p.descontinuado
                  ? { clase: "badge-desc", texto: "Descontinuado" }
                  : getEstado(p.stock, p.stockMinimo);
                return (
                  <tr key={p.id} className={p.descontinuado ? "fila-desc" : ""}>
                    <td className="td-nombre">{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td className="td-codigo">{p.codigoBarras}</td>
                    <td>{fmt(p.precioCompra)}</td>
                    <td>{fmt(p.precioVenta)}</td>
                    <td><strong>{p.stock}</strong></td>
                    <td>{p.stockMinimo}</td>
                    <td><span className={"badge " + clase}>{texto}</span></td>
                    <td className="td-acciones">
                      {!p.descontinuado ? (
                        <>
                          <button className="btn-accion" onClick={() => abrirEditar(p)}>Editar</button>
                          <button className="btn-accion btn-desc" onClick={() => setModalDescont(p.id)}>Descontinuar</button>
                        </>
                      ) : (
                        <button className="btn-accion" onClick={() => reactivar(p.id)}>Reactivar</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalForm && (
        <Modal titulo={editId !== null ? "Editar producto" : "Agregar producto"} onClose={cerrarModal}>
          <div className="campo">
            <label>Nombre del producto</label>
            <input name="nombre" value={form.nombre} onChange={cambio} placeholder="Ej: Arroz x 500g" />
            {errores.nombre && <span className="campo-error">{errores.nombre}</span>}
          </div>
          <div className="campo-grid">
            <div className="campo">
              <label>Categoria</label>
              <select name="categoria" value={form.categoria} onChange={cambio}>
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Codigo de barras</label>
              <input name="codigoBarras" value={form.codigoBarras} onChange={cambio} placeholder="7701234567890" />
              {errores.codigoBarras && <span className="campo-error">{errores.codigoBarras}</span>}
            </div>
          </div>
          <div className="campo-grid">
            <div className="campo">
              <label>Precio de compra ($)</label>
              <input name="precioCompra" type="number" min="0" value={form.precioCompra} onChange={cambio} placeholder="0" />
              {errores.precioCompra && <span className="campo-error">{errores.precioCompra}</span>}
            </div>
            <div className="campo">
              <label>Precio de venta ($)</label>
              <input name="precioVenta" type="number" min="0" value={form.precioVenta} onChange={cambio} placeholder="0" />
              {errores.precioVenta && <span className="campo-error">{errores.precioVenta}</span>}
            </div>
          </div>
          <div className="campo-grid">
            <div className="campo">
              <label>Stock actual</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={cambio} placeholder="0" />
              {errores.stock && <span className="campo-error">{errores.stock}</span>}
            </div>
            <div className="campo">
              <label>Stock minimo</label>
              <input name="stockMinimo" type="number" min="0" value={form.stockMinimo} onChange={cambio} placeholder="0" />
              {errores.stockMinimo && <span className="campo-error">{errores.stockMinimo}</span>}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
            <button className="btn-guardar" onClick={guardar}>
              {editId !== null ? "Guardar cambios" : "Agregar producto"}
            </button>
          </div>
        </Modal>
      )}

      {modalDescont !== null && (
        <Modal titulo="Descontinuar producto" onClose={() => setModalDescont(null)}>
          <p className="modal-texto">
            El producto <strong>{productos.find((p) => p.id === modalDescont)?.nombre}</strong> sera marcado
            como descontinuado y no aparecera en el inventario activo. Podras reactivarlo cuando quieras.
          </p>
          <div className="modal-footer">
            <button className="btn-cancelar" onClick={() => setModalDescont(null)}>Cancelar</button>
            <button className="btn-desc-confirm" onClick={descontinuar}>Descontinuar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
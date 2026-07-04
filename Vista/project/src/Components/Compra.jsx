import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import "./Compra.css";

const proveedoresIniciales = [
  { id: 1, nombre: "Distribuidora El Sol", contacto: "Carlos Mejia", telefono: "310 555 0001", productos: "Bebidas, Snacks" },
  { id: 2, nombre: "Lacteos del Valle", contacto: "Rosa Herrera", telefono: "315 555 0002", productos: "Lacteos" },
  { id: 3, nombre: "Snacks Colombia", contacto: "Pedro Rios", telefono: "300 555 0003", productos: "Snacks, Dulces" },
];

const historialInicial = [
  { id: "C001", proveedor: "Distribuidora El Sol", fecha: "01/07/2026", total: 320000, estado: "Completada", items: [] },
  { id: "C002", proveedor: "Lacteos del Valle", fecha: "02/07/2026", total: 185000, estado: "Completada", items: [] },
  { id: "C003", proveedor: "Snacks Colombia", fecha: "03/07/2026", total: 210000, estado: "Pendiente", items: [] },
  { id: "C000", proveedor: "Distribuidora El Sol", fecha: "15/06/2026", total: 175000, estado: "Cancelada", items: [] },
];

const estadoBadge = {
  Completada: "badge-comp",
  Pendiente:  "badge-pend",
  Cancelada:  "badge-canc",
};

function formatPesos(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

function ModalCompra({ compra, proveedores, productos, onClose, onGuardar }) {
  const [form, setForm] = useState(
    compra || { proveedor: "", fecha: "", estado: "Pendiente" }
  );
  const [items, setItems] = useState(compra?.items || []);
  const [productoSel, setProductoSel] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarItem = () => {
    if (!productoSel) return;
    const prod = productos.find((p) => String(p.id) === String(productoSel));
    if (!prod) return;
    const existe = items.find((i) => i.id === prod.id);
    if (existe) {
      setItems(items.map((i) => i.id === prod.id ? { ...i, cantidad: i.cantidad + Number(cantidad) } : i));
    } else {
      setItems([...items, { id: prod.id, nombre: prod.nombre, precioCompra: prod.precioCompra, cantidad: Number(cantidad) }]);
    }
    setProductoSel("");
    setCantidad(1);
  };

  const quitarItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const total = items.reduce((acc, i) => acc + i.precioCompra * i.cantidad, 0);

  const handleGuardar = () => {
    if (!form.proveedor || !form.fecha || items.length === 0) return;
    onGuardar({ ...form, items, total });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card-lg">
        <div className="modal-header">
          <h2 className="modal-title">{compra ? "Editar compra" : "Nueva compra"}</h2>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>

        <div className="campo-grid">
          <div className="campo">
            <label>Proveedor</label>
            <select name="proveedor" value={form.proveedor} onChange={handleChange}>
              <option value="">Selecciona un proveedor</option>
              {proveedores.map((p) => <option key={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="campo">
            <label>Fecha</label>
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
          </div>
        </div>

        <div className="campo">
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option>Pendiente</option>
            <option>Completada</option>
            <option>Cancelada</option>
          </select>
        </div>

        <div className="campo">
          <label>Agregar productos</label>
          <div className="agregar-item-row">
            <select
              value={productoSel}
              onChange={(e) => setProductoSel(e.target.value)}
            >
              <option value="">Selecciona un producto</option>
              {productos.filter((p) => !p.descontinuado).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {formatPesos(p.precioCompra)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              style={{ width: 70 }}
            />
            <button className="btn-agregar-item" onClick={agregarItem}>Agregar</button>
          </div>
        </div>

        {items.length > 0 && (
          <table className="compra-table" style={{ marginBottom: "1rem" }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>P. Compra</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.nombre}</td>
                  <td>{i.cantidad}</td>
                  <td>{formatPesos(i.precioCompra)}</td>
                  <td>{formatPesos(i.precioCompra * i.cantidad)}</td>
                  <td>
                    <button className="btn-accion btn-canc" onClick={() => quitarItem(i.id)}>Quitar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="modal-total-row">
          <span className="modal-total-label">Total</span>
          <span className="modal-total-val">{formatPesos(total)}</span>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function ModalProveedor({ proveedor, onClose, onGuardar }) {
  const [form, setForm] = useState(
    proveedor || { nombre: "", contacto: "", telefono: "", productos: "" }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    if (!form.nombre || !form.contacto || !form.telefono) return;
    onGuardar(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">{proveedor ? "Editar proveedor" : "Nuevo proveedor"}</h2>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        <div className="campo">
          <label>Nombre</label>
          <input type="text" name="nombre" placeholder="Nombre del proveedor" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Contacto</label>
          <input type="text" name="contacto" placeholder="Nombre del contacto" value={form.contacto} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Telefono</label>
          <input type="text" name="telefono" placeholder="300 000 0000" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Productos que provee</label>
          <input type="text" name="productos" placeholder="Bebidas, Snacks..." value={form.productos} onChange={handleChange} />
        </div>
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default function Compra() {
  const { usuario } = useAuth();
  const { productos, actualizarProducto } = useProducts();

  const [tab, setTab] = useState("compras");
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState(proveedoresIniciales);
  const [historial, setHistorial] = useState(historialInicial);

  const [modalCompra, setModalCompra] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [compraEditando, setCompraEditando] = useState(null);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  const totalCompras = compras.reduce((acc, c) => acc + Number(c.total), 0);
  const pendientes = compras.filter((c) => c.estado === "Pendiente").length;

  const actualizarStock = (items) => {
    items.forEach((item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (prod) {
        actualizarProducto(prod.id, { stock: prod.stock + item.cantidad });
      }
    });
  };

  const guardarCompra = (form) => {
    if (compraEditando) {
      const anterior = compraEditando;
      const nuevaCompra = { ...compraEditando, ...form, total: Number(form.total) };

      if (anterior.estado !== "Completada" && form.estado === "Completada") {
        actualizarStock(form.items);
      }

      setCompras(compras.map((c) => c.id === compraEditando.id ? nuevaCompra : c));
      setHistorial(historial.map((h) => h.id === compraEditando.id ? nuevaCompra : h));
    } else {
      const nueva = {
        ...form,
        id: "C" + String(compras.length + 5).padStart(3, "0"),
        total: Number(form.total),
      };

      if (form.estado === "Completada") {
        actualizarStock(form.items);
      }

      setCompras([...compras, nueva]);
      setHistorial([nueva, ...historial]);
    }
    setModalCompra(false);
    setCompraEditando(null);
  };

  const guardarProveedor = (form) => {
    if (proveedorEditando) {
      setProveedores(proveedores.map((p) =>
        p.id === proveedorEditando.id ? { ...proveedorEditando, ...form } : p
      ));
    } else {
      setProveedores([...proveedores, { ...form, id: Date.now() }]);
    }
    setModalProveedor(false);
    setProveedorEditando(null);
  };

  const abrirEditarCompra = (compra) => {
    setCompraEditando(compra);
    setModalCompra(true);
  };

  const abrirEditarProveedor = (proveedor) => {
    setProveedorEditando(proveedor);
    setModalProveedor(true);
  };

  return (
    <div className="compra-page">
      <div className="compra-header">
        <div>
          <h1 className="compra-title">Compras</h1>
          <p className="compra-sub">{usuario?.email}</p>
        </div>
        {tab === "compras" && (
          <button className="btn-nuevo" onClick={() => { setCompraEditando(null); setModalCompra(true); }}>
            + Nueva compra
          </button>
        )}
        {tab === "proveedores" && (
          <button className="btn-nuevo" onClick={() => { setProveedorEditando(null); setModalProveedor(true); }}>
            + Nuevo proveedor
          </button>
        )}
      </div>

      <div className="compra-tabs">
        {["compras", "proveedores", "historial"].map((t) => (
          <button
            key={t}
            className={"compra-tab" + (tab === t ? " active" : "")}
            onClick={() => setTab(t)}
          >
            {t === "compras" && "Registro de compras"}
            {t === "proveedores" && "Proveedores"}
            {t === "historial" && "Historial"}
          </button>
        ))}
      </div>

      {tab === "compras" && (
        <div className="compra-section">
          <div className="metric-grid">
            <div className="metric-card">
              <p className="metric-label">Total compras</p>
              <p className="metric-value">{compras.length}</p>
              <p className="metric-sub">Este mes</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Valor total</p>
              <p className="metric-value">{formatPesos(totalCompras)}</p>
              <p className="metric-sub">Este mes</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Pendientes</p>
              <p className="metric-value">{pendientes}</p>
              <p className="metric-sub">Por recibir</p>
            </div>
          </div>

          {compras.length === 0 ? (
            <div className="compra-vacio">No hay compras registradas. Crea una nueva.</div>
          ) : (
            <table className="compra-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Proveedor</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.proveedor}</td>
                    <td>{c.fecha}</td>
                    <td>{c.items?.length || 0} productos</td>
                    <td>{formatPesos(c.total)}</td>
                    <td><span className={"badge " + estadoBadge[c.estado]}>{c.estado}</span></td>
                    <td>
                      <button className="btn-accion" onClick={() => abrirEditarCompra(c)}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "proveedores" && (
        <div className="compra-section">
          <table className="compra-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Telefono</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.contacto}</td>
                  <td>{p.telefono}</td>
                  <td>{p.productos}</td>
                  <td>
                    <button className="btn-accion" onClick={() => abrirEditarProveedor(p)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "historial" && (
        <div className="compra-section">
          <div className="metric-grid">
            <div className="metric-card">
              <p className="metric-label">Total registros</p>
              <p className="metric-value">{historial.length}</p>
              <p className="metric-sub">Ultimos 30 dias</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Completadas</p>
              <p className="metric-value">{historial.filter((h) => h.estado === "Completada").length}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Canceladas</p>
              <p className="metric-value">{historial.filter((h) => h.estado === "Cancelada").length}</p>
            </div>
          </div>

          <table className="compra-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h) => (
                <tr key={h.id + h.fecha}>
                  <td>#{h.id}</td>
                  <td>{h.proveedor}</td>
                  <td>{h.fecha}</td>
                  <td>{formatPesos(h.total)}</td>
                  <td><span className={"badge " + estadoBadge[h.estado]}>{h.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalCompra && (
        <ModalCompra
          compra={compraEditando}
          proveedores={proveedores}
          productos={productos}
          onClose={() => { setModalCompra(false); setCompraEditando(null); }}
          onGuardar={guardarCompra}
        />
      )}

      {modalProveedor && (
        <ModalProveedor
          proveedor={proveedorEditando}
          onClose={() => { setModalProveedor(false); setProveedorEditando(null); }}
          onGuardar={guardarProveedor}
        />
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import "./Venta.css";

const HISTORIAL_INICIAL = [
  { id: "V001", fecha: "03/07/2026", items: [{ id: 4, nombre: "Gaseosa 1.5L", cantidad: 2, precioVenta: 3700 }, { id: 1, nombre: "Arroz x 500g", cantidad: 1, precioVenta: 2500 }], total: 9900, metodoPago: "Efectivo", estado: "Completada", motivo: "" },
  { id: "V002", fecha: "04/07/2026", items: [{ id: 5, nombre: "Leche 900ml", cantidad: 1, precioVenta: 4200 }], total: 4200, metodoPago: "Transferencia", estado: "Completada", motivo: "" },
  { id: "V003", fecha: "04/07/2026", items: [{ id: 2, nombre: "Aceite 1L", cantidad: 1, precioVenta: 12000 }, { id: 7, nombre: "Jabon rey", cantidad: 2, precioVenta: 2800 }], total: 17600, metodoPago: "Efectivo", estado: "Cancelada", motivo: "Error en el precio" },
];

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

function Modal({ titulo, onClose, children }) {
  return (
    <div className="venta-overlay" onClick={onClose}>
      <div className="venta-modal" onClick={(e) => e.stopPropagation()}>
        <div className="venta-modal-header">
          <span className="venta-modal-titulo">{titulo}</span>
          <button className="venta-modal-close" onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Recibo({ venta, onClose }) {
  return (
    <Modal titulo="Recibo electronico" onClose={onClose}>
      <div className="recibo">
        <div className="recibo-header">
          <p className="recibo-tienda">Tentaciones Marlly</p>
          <p className="recibo-sub">Sistema Ke-rico</p>
          <p className="recibo-sub">Fecha: {venta.fecha}</p>
          <p className="recibo-sub">Venta #{venta.id}</p>
        </div>
        <div className="recibo-linea" />
        <table className="recibo-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.items.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>{fmt(item.precioVenta)}</td>
                <td>{fmt(item.precioVenta * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="recibo-linea" />
        <div className="recibo-total-row">
          <span>Total</span>
          <span className="recibo-total-val">{fmt(venta.total)}</span>
        </div>
        <div className="recibo-total-row">
          <span>Metodo de pago</span>
          <span>{venta.metodoPago}</span>
        </div>
        <div className="recibo-linea" />
        <p className="recibo-footer">Gracias por su compra</p>
      </div>
      <div className="modal-footer">
        <button className="btn-cancelar" onClick={onClose}>Cerrar</button>
        <button className="btn-guardar" onClick={() => window.print()}>Imprimir</button>
      </div>
    </Modal>
  );
}

export default function Venta() {
  const { usuario } = useAuth();
  const { productos, actualizarProducto } = useProducts();

  const [tab, setTab] = useState("nueva");
  const [historial, setHistorial] = useState(HISTORIAL_INICIAL);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [ventasPausadas, setVentasPausadas] = useState([]);
  const [nextId, setNextId] = useState(4);

  const [modalCancelar, setModalCancelar] = useState(false);
  const [modalPausadas, setModalPausadas] = useState(false);
  const [modalRecibo, setModalRecibo] = useState(null);
  const [modalCancelarHistorial, setModalCancelarHistorial] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [motivoError, setMotivoError] = useState("");

  const productosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return productos.filter((p) =>
      !p.descontinuado &&
      p.stock > 0 && (
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.codigoBarras && p.codigoBarras.includes(q))
      )
    );
  }, [productos, busqueda]);

  const total = useMemo(() =>
    carrito.reduce((acc, item) => acc + item.precioVenta * item.cantidad, 0),
    [carrito]
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((i) => i.id === producto.id);
    const enCarrito = existe ? existe.cantidad : 0;
    if (enCarrito >= producto.stock) return;
    if (existe) {
      setCarrito(carrito.map((i) => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, delta) => {
    const prod = productos.find((p) => p.id === id);
    setCarrito(carrito
      .map((i) => {
        if (i.id !== id) return i;
        const nueva = i.cantidad + delta;
        if (delta > 0 && prod && nueva > prod.stock) return i;
        return { ...i, cantidad: nueva };
      })
      .filter((i) => i.cantidad > 0)
    );
  };

  const cobrar = () => {
    if (carrito.length === 0) return;
    const idVenta = "V" + String(nextId).padStart(3, "0");
    const fecha = new Date().toLocaleDateString("es-CO");
    const nuevaVenta = {
      id: idVenta,
      fecha,
      items: carrito.map((i) => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad, precioVenta: i.precioVenta })),
      total,
      metodoPago,
      estado: "Completada",
      motivo: "",
    };

    carrito.forEach((item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (prod) {
        actualizarProducto(prod.id, { stock: prod.stock - item.cantidad });
      }
    });

    setHistorial([nuevaVenta, ...historial]);
    setNextId(nextId + 1);
    setCarrito([]);
    setMetodoPago("Efectivo");
    setModalRecibo(nuevaVenta);
  };

  const pausarVenta = () => {
    if (carrito.length === 0) return;
    setVentasPausadas([...ventasPausadas, { carrito, metodoPago, pausadaEn: new Date().toLocaleTimeString("es-CO") }]);
    setCarrito([]);
    setMetodoPago("Efectivo");
  };

  const reanudarVenta = (index) => {
    if (carrito.length > 0) {
      setVentasPausadas([...ventasPausadas, { carrito, metodoPago, pausadaEn: new Date().toLocaleTimeString("es-CO") }]);
    }
    const pausada = ventasPausadas[index];
    setCarrito(pausada.carrito);
    setMetodoPago(pausada.metodoPago);
    setVentasPausadas(ventasPausadas.filter((_, i) => i !== index));
    setModalPausadas(false);
  };

  const confirmarCancelar = () => {
    setCarrito([]);
    setMetodoPago("Efectivo");
    setModalCancelar(false);
    setMotivo("");
  };

  const cancelarVentaHistorial = () => {
    if (!motivo.trim()) { setMotivoError("El motivo es obligatorio."); return; }
    const venta = historial.find((v) => v.id === modalCancelarHistorial);

    venta.items.forEach((item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (prod) {
        actualizarProducto(prod.id, { stock: prod.stock + item.cantidad });
      }
    });

    setHistorial(historial.map((v) =>
      v.id === modalCancelarHistorial ? { ...v, estado: "Cancelada", motivo } : v
    ));
    setModalCancelarHistorial(null);
    setMotivo("");
    setMotivoError("");
  };

  const hoy = new Date().toLocaleDateString("es-CO");
  const ventasHoy = historial.filter((v) => v.fecha === hoy && v.estado === "Completada");
  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="venta-page">
      <div className="venta-header">
        <div>
          <h1 className="venta-title">Ventas</h1>
          <p className="venta-sub">{usuario?.email}</p>
        </div>
        {ventasPausadas.length > 0 && (
          <button className="btn-pausadas" onClick={() => setModalPausadas(true)}>
            Ventas pausadas ({ventasPausadas.length})
          </button>
        )}
      </div>

      <div className="venta-tabs">
        {["nueva", "historial"].map((t) => (
          <button key={t} className={"venta-tab" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>
            {t === "nueva" ? "Nueva venta" : "Historial"}
          </button>
        ))}
      </div>

      {tab === "nueva" && (
        <div className="venta-grid">
          <div className="venta-panel">
            <p className="panel-title">Productos disponibles</p>
            <div className="venta-search">
              <input
                type="text"
                placeholder="Buscar por nombre o codigo de barras..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            {productosFiltrados.length === 0 ? (
              <p className="venta-vacio">No se encontraron productos con stock disponible.</p>
            ) : (
              <div className="prod-grid">
                {productosFiltrados.map((p) => (
                  <div key={p.id} className="prod-card" onClick={() => agregarAlCarrito(p)}>
                    <p className="prod-nombre">{p.nombre}</p>
                    <p className="prod-precio">{fmt(p.precioVenta)}</p>
                    <p className="prod-stock">Stock: {p.stock}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="venta-caja">
            <p className="caja-titulo">Caja actual</p>

            {carrito.length === 0 ? (
              <p className="caja-vacia">Agrega productos haciendo clic en las tarjetas.</p>
            ) : (
              <div className="caja-items">
                {carrito.map((item) => (
                  <div key={item.id} className="caja-item">
                    <span className="caja-item-nombre">{item.nombre}</span>
                    <div className="caja-cant">
                      <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                    </div>
                    <span className="caja-item-total">{fmt(item.precioVenta * item.cantidad)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="caja-total-row">
              <span className="caja-total-label">Total</span>
              <span className="caja-total-val">{fmt(total)}</span>
            </div>

            <div className="caja-pago">
              <p className="caja-pago-label">Metodo de pago</p>
              <div className="caja-pago-btns">
                {["Efectivo", "Transferencia"].map((m) => (
                  <button
                    key={m}
                    className={"pago-btn" + (metodoPago === m ? " active" : "")}
                    onClick={() => setMetodoPago(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="caja-acciones">
              <button className="btn-cobrar" onClick={cobrar} disabled={carrito.length === 0}>
                Cobrar {fmt(total)}
              </button>
              <button className="btn-pausar" onClick={pausarVenta} disabled={carrito.length === 0}>
                Pausar venta
              </button>
              <button className="btn-cancelar-venta" onClick={() => setModalCancelar(true)} disabled={carrito.length === 0}>
                Cancelar venta
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "historial" && (
        <div>
          <div className="metric-grid">
            <div className="metric-card">
              <p className="metric-label">Ventas hoy</p>
              <p className="metric-value">{ventasHoy.length}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Total hoy</p>
              <p className="metric-value">{fmt(totalHoy)}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Total registros</p>
              <p className="metric-value">{historial.length}</p>
            </div>
          </div>

          <table className="venta-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((v) => (
                <tr key={v.id}>
                  <td>#{v.id}</td>
                  <td>{v.fecha}</td>
                  <td>{v.items.length} {v.items.length === 1 ? "item" : "items"}</td>
                  <td>{fmt(v.total)}</td>
                  <td>{v.metodoPago}</td>
                  <td>
                    <span className={"badge " + (v.estado === "Completada" ? "badge-comp" : "badge-canc")}>
                      {v.estado}
                    </span>
                  </td>
                  <td className="td-acciones">
                    <button className="btn-accion" onClick={() => setModalRecibo(v)}>Recibo</button>
                    {v.estado === "Completada" && (
                      <button className="btn-accion btn-canc" onClick={() => { setModalCancelarHistorial(v.id); setMotivo(""); setMotivoError(""); }}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalCancelar && (
        <Modal titulo="Cancelar venta en curso" onClose={() => setModalCancelar(false)}>
          <p className="modal-texto">Se descartaran los productos agregados a la caja. Esta accion no afecta el historial.</p>
          <div className="modal-footer">
            <button className="btn-cancelar" onClick={() => setModalCancelar(false)}>Volver</button>
            <button className="btn-desc-confirm" onClick={confirmarCancelar}>Cancelar venta</button>
          </div>
        </Modal>
      )}

      {modalPausadas && (
        <Modal titulo="Ventas pausadas" onClose={() => setModalPausadas(false)}>
          {ventasPausadas.map((vp, i) => (
            <div key={i} className="pausada-item">
              <div>
                <p className="pausada-hora">Pausada a las {vp.pausadaEn}</p>
                <p className="pausada-desc">{vp.carrito.length} productos — {fmt(vp.carrito.reduce((a, c) => a + c.precioVenta * c.cantidad, 0))}</p>
              </div>
              <button className="btn-guardar" onClick={() => reanudarVenta(i)}>Reanudar</button>
            </div>
          ))}
          <div className="modal-footer">
            <button className="btn-cancelar" onClick={() => setModalPausadas(false)}>Cerrar</button>
          </div>
        </Modal>
      )}

      {modalCancelarHistorial && (
        <Modal titulo="Cancelar venta registrada" onClose={() => { setModalCancelarHistorial(null); setMotivo(""); setMotivoError(""); }}>
          <p className="modal-texto">
            Al cancelar esta venta, los productos seran reintegrados al stock. Ingresa el motivo de cancelacion.
          </p>
          <div className="campo">
            <label>Motivo de cancelacion</label>
            <input
              type="text"
              placeholder="Ej: Error en el precio, devolucion del cliente..."
              value={motivo}
              onChange={(e) => { setMotivo(e.target.value); setMotivoError(""); }}
            />
            {motivoError && <span className="campo-error">{motivoError}</span>}
          </div>
          <div className="modal-footer">
            <button className="btn-cancelar" onClick={() => { setModalCancelarHistorial(null); setMotivo(""); setMotivoError(""); }}>Volver</button>
            <button className="btn-desc-confirm" onClick={cancelarVentaHistorial}>Confirmar cancelacion</button>
          </div>
        </Modal>
      )}

      {modalRecibo && (
        <Recibo venta={modalRecibo} onClose={() => setModalRecibo(null)} />
      )}
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Administracion.css";

const datosInformes = [
  { categoria: "Bebidas", precioCompra: 1200, precioVenta: 2000, unidades: 143, ganancia: 74000 },
  { categoria: "Snacks", precioCompra: 800, precioVenta: 1500, unidades: 79, ganancia: 56000 },
  { categoria: "Lacteos", precioCompra: 2500, precioVenta: 3200, unidades: 54, ganancia: 32500 },
  { categoria: "Aseo", precioCompra: 3000, precioVenta: 4500, unidades: 21, ganancia: 22000 },
];

const datosRotacion = [
  { producto: "Gaseosa 400ml", unidades: 143, rotacion: "Alta" },
  { producto: "Agua 600ml", unidades: 112, rotacion: "Alta" },
  { producto: "Papas margarita", unidades: 79, rotacion: "Normal" },
  { producto: "Leche bolsa", unidades: 54, rotacion: "Normal" },
  { producto: "Jabon rey", unidades: 21, rotacion: "Baja" },
  { producto: "Aceite 3L", unidades: 2, rotacion: "Baja" },
];

const usuariosIniciales = [
  { id: 1, nombre: "Marlly Rincon", correo: "admin@tentaciones.com", rol: "Administrador" },
  { id: 2, nombre: "Juan Perez", correo: "juan@tentaciones.com", rol: "Vendedor" },
  { id: 3, nombre: "Maria Lopez", correo: "maria@tentaciones.com", rol: "Vendedor" },
];

const permisos = [
  { accion: "Registrar ventas", admin: true, vendedor: true },
  { accion: "Anular ventas", admin: true, vendedor: false },
  { accion: "Cambiar precios", admin: true, vendedor: false },
  { accion: "Ver reportes", admin: true, vendedor: false },
  { accion: "Gestionar usuarios", admin: true, vendedor: false },
  { accion: "Ver inventario", admin: true, vendedor: true },
];

const maxUnidades = 143;

function formatPesos(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

function BadgeRotacion({ tipo }) {
  const estilos = {
    Alta: "badge-alta",
    Normal: "badge-normal",
    Baja: "badge-baja",
  };
  return <span className={"badge " + estilos[tipo]}>{tipo}</span>;
}

function BadgeRol({ rol }) {
  return (
    <span className={"badge " + (rol === "Administrador" ? "badge-admin" : "badge-vendedor")}>
      {rol}
    </span>
  );
}

export default function Administracion() {
  const { usuario } = useAuth();
  const [tabActiva, setTabActiva] = useState("informes");
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const totalGanancia = datosInformes.reduce((acc, d) => acc + d.ganancia, 0);
  const mejorCategoria = datosInformes.reduce((a, b) => (a.ganancia > b.ganancia ? a : b));

  const categorias = ["Todas", ...datosInformes.map((d) => d.categoria)];
  const informesFiltrados =
    filtroCategoria === "Todas"
      ? datosInformes
      : datosInformes.filter((d) => d.categoria === filtroCategoria);

  const cambiarRol = (id, nuevoRol) => {
    setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u)));
  };

  const totalAdmins = usuarios.filter((u) => u.rol === "Administrador").length;
  const totalVendedores = usuarios.filter((u) => u.rol === "Vendedor").length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Administración</h1>
          <p className="admin-sub">Bienvenido, {usuario?.email}</p>
        </div>
      </div>

      <div className="admin-tabs">
        {["informes", "rotacion", "permisos"].map((tab) => (
          <button
            key={tab}
            className={"admin-tab" + (tabActiva === tab ? " active" : "")}
            onClick={() => setTabActiva(tab)}
          >
            {tab === "informes" && "Informes"}
            {tab === "rotacion" && "Rotacion de productos"}
            {tab === "permisos" && "Roles y permisos"}
          </button>
        ))}
      </div>

      {tabActiva === "informes" && (
        <div className="admin-section">
          <div className="metric-grid">
            <div className="metric-card">
              <p className="metric-label">Ganancia total</p>
              <p className="metric-value">{formatPesos(totalGanancia)}</p>
              <p className="metric-sub">Este mes</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Categorias activas</p>
              <p className="metric-value">{datosInformes.length}</p>
              <p className="metric-sub">Con ventas registradas</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Mejor categoria</p>
              <p className="metric-value">{mejorCategoria.categoria}</p>
              <p className="metric-sub">{formatPesos(mejorCategoria.ganancia)} ganancia</p>
            </div>
          </div>

          <div className="section-toolbar">
            <p className="section-title">Ganancia por categoria</p>
            <select
              className="filtro-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Precio compra prom.</th>
                <th>Precio venta prom.</th>
                <th>Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {informesFiltrados.map((d) => (
                <tr key={d.categoria}>
                  <td>{d.categoria}</td>
                  <td>{formatPesos(d.precioCompra)}</td>
                  <td>{formatPesos(d.precioVenta)}</td>
                  <td className="ganancia-positiva">{formatPesos(d.ganancia)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tabActiva === "rotacion" && (
        <div className="admin-section">
          <div className="metric-grid">
            <div className="metric-card">
              <p className="metric-label">Más vendido</p>
              <p className="metric-value">{datosRotacion[0].producto}</p>
              <p className="metric-sub">{datosRotacion[0].unidades} unidades</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Menos vendido</p>
              <p className="metric-value">{datosRotacion[datosRotacion.length - 1].producto}</p>
              <p className="metric-sub">{datosRotacion[datosRotacion.length - 1].unidades} unidades</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Rotación baja</p>
              <p className="metric-value">{datosRotacion.filter((d) => d.rotacion === "Baja").length}</p>
              <p className="metric-sub">Productos</p>
            </div>
          </div>

          <p className="section-title" style={{ marginBottom: "1rem" }}>
            Volumen de ventas por producto
          </p>

          <div className="barras-container">
            {datosRotacion.map((d) => {
              const pct = Math.round((d.unidades / maxUnidades) * 100);
              const color =
                d.rotacion === "Alta"
                  ? "#1D9E75"
                  : d.rotacion === "Normal"
                  ? "#EF9F27"
                  : "#E24B4A";
              return (
                <div className="barra-fila" key={d.producto}>
                  <span className="barra-label">{d.producto}</span>
                  <div className="barra-track">
                    <div
                      className="barra-fill"
                      style={{ width: pct + "%", background: color }}
                    />
                  </div>
                  <span className="barra-val">{d.unidades}</span>
                </div>
              );
            })}
          </div>

          <table className="admin-table" style={{ marginTop: "1.5rem" }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades vendidas</th>
                <th>Rotacion</th>
              </tr>
            </thead>
            <tbody>
              {datosRotacion.map((d) => (
                <tr key={d.producto}>
                  <td>{d.producto}</td>
                  <td>{d.unidades}</td>
                  <td>
                    <BadgeRotacion tipo={d.rotacion} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tabActiva === "permisos" && (
        <div className="admin-section">
          <div className="metric-grid">
            <div className="metric-card">
              <p className="metric-label">Total usuarios</p>
              <p className="metric-value">{usuarios.length}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Administradores</p>
              <p className="metric-value">{totalAdmins}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Vendedores</p>
              <p className="metric-value">{totalVendedores}</p>
            </div>
          </div>

          <p className="section-title" style={{ marginBottom: "0.75rem" }}>
            Usuarios del sistema
          </p>
          <table className="admin-table" style={{ marginBottom: "1.5rem" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>
                    <select
                      value={u.rol}
                      onChange={(e) => cambiarRol(u.id, e.target.value)}
                      className="rol-select"
                    >
                      <option>Administrador</option>
                      <option>Vendedor</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="section-title" style={{ marginBottom: "0.75rem" }}>
            Matriz de permisos
          </p>
          <table className="admin-table perm-table">
            <thead>
              <tr>
                <th>Accion</th>
                <th>Administrador</th>
                <th>Vendedor</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((p) => (
                <tr key={p.accion}>
                  <td>{p.accion}</td>
                  <td className="perm-centro">
                    {p.admin ? (
                      <span className="perm-check">&#10003;</span>
                    ) : (
                      <span className="perm-cross">&#10007;</span>
                    )}
                  </td>
                  <td className="perm-centro">
                    {p.vendedor ? (
                      <span className="perm-check">&#10003;</span>
                    ) : (
                      <span className="perm-cross">&#10007;</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

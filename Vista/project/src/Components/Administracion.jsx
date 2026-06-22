import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Inventario() {
  const { usuario } = useAuth();
  // Ya tienes acceso al usuario logueado
}

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin",
      role: "Administrador",
    },
    {
      id: 2,
      name: "Juan",
      role: "Vendedor",
    },
  ]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Usuarios y Roles</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>

              <td>
                <select
                  value={user.role}
                >
                  <option>
                    Administrador
                  </option>

                  <option>
                    Vendedor
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
cat > /home/claude/Administracion.jsx << 'ENDOFFILE'
import { useState } from "react";

// ─── Datos de ejemplo ────────────────────────────────────────────────────────
const categoriasData = [
  { categoria: "Bebidas",  compra: 1200, venta: 2000, ganancia: 74000 },
  { categoria: "Snacks",   compra: 800,  venta: 1500, ganancia: 56000 },
  { categoria: "Lacteos",  compra: 2500, venta: 3200, ganancia: 32500 },
  { categoria: "Aseo",     compra: 3000, venta: 4500, ganancia: 22000 },
];

const productosMasVendidos = [
  { id: "P001", nombre: "Coca-Cola 600ml",    categoria: "Bebidas", vendidos: 320, rotacion: "Alta"  },
  { id: "P002", nombre: "Papas Margarita",    categoria: "Snacks",  vendidos: 280, rotacion: "Alta"  },
  { id: "P003", nombre: "Leche Entera 1L",    categoria: "Lacteos", vendidos: 210, rotacion: "Alta"  },
  { id: "P004", nombre: "Agua Cristal 500ml", categoria: "Bebidas", vendidos: 195, rotacion: "Alta"  },
  { id: "P005", nombre: "Detergente Ariel",   categoria: "Aseo",    vendidos: 88,  rotacion: "Media" },
  { id: "P006", nombre: "Queso Doblecrema",   categoria: "Lacteos", vendidos: 42,  rotacion: "Baja"  },
  { id: "P007", nombre: "Jabon Rey",          categoria: "Aseo",    vendidos: 18,  rotacion: "Baja"  },
];

const usuariosData = [
  { id: "U001", nombre: "Carlos Perez",  rol: "Administrador", permisos: { verReportes: true,  realizarVentas: true,  anularVentas: true,  cambiarPrecios: true  } },
  { id: "U002", nombre: "Maria Lopez",   rol: "Vendedor",      permisos: { verReportes: false, realizarVentas: true,  anularVentas: false, cambiarPrecios: false } },
  { id: "U003", nombre: "Andres Torres", rol: "Vendedor",      permisos: { verReportes: false, realizarVentas: true,  anularVentas: false, cambiarPrecios: false } },
  { id: "U004", nombre: "Luisa Ramirez", rol: "Administrador", permisos: { verReportes: true,  realizarVentas: true,  anularVentas: true,  cambiarPrecios: true  } },
];

const ROLES = ["Administrador", "Vendedor"];
const PERMISOS_DEFAULT = {
  Administrador: { verReportes: true,  realizarVentas: true,  anularVentas: true,  cambiarPrecios: true  },
  Vendedor:      { verReportes: false, realizarVentas: true,  anularVentas: false, cambiarPrecios: false },
};

const fmt = (n) => "$" + Number(n).toLocaleString("es-CO");
const maxGanancia = Math.max(...categoriasData.map((c) => c.ganancia));

// ─── RF 2.1 — Informes ───────────────────────────────────────────────────────
function TabInformes() {
  const totalGanancia = categoriasData.reduce((s, c) => s + c.ganancia, 0);
  const mejorCategoria = categoriasData.reduce((a, b) => (a.ganancia > b.ganancia ? a : b));

  return (
    <div style={st.tabContent}>
      <div style={st.kpiRow}>
        <div style={st.kpiCard}>
          <span style={st.kpiLabel}>Ganancia total</span>
          <span style={st.kpiValue}>{fmt(totalGanancia)}</span>
          <span style={st.kpiSub}>Este mes</span>
        </div>
        <div style={st.kpiCard}>
          <span style={st.kpiLabel}>Productos con ganancia</span>
          <span style={st.kpiValueLg}>12</span>
          <span style={st.kpiSub}>De 15 registrados</span>
        </div>
        <div style={st.kpiCard}>
          <span style={st.kpiLabel}>Mejor categoria</span>
          <span style={st.kpiValueLg}>{mejorCategoria.categoria}</span>
          <span style={st.kpiSub}>{fmt(mejorCategoria.ganancia)} ganancia</span>
        </div>
      </div>

      <div style={st.section}>
        <h3 style={st.sectionTitle}>Ganancia por categoria (Precio venta - Precio compra)</h3>
        <table style={st.table}>
          <thead>
            <tr>
              {["Categoria", "Precio compra prom.", "Precio venta prom.", "Ganancia"].map((h) => (
                <th key={h} style={st.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoriasData.map((row, i) => (
              <tr key={row.categoria} style={i % 2 === 0 ? st.trEven : st.trOdd}>
                <td style={{ ...st.td, fontWeight: 600 }}>{row.categoria}</td>
                <td style={st.td}>{fmt(row.compra)}</td>
                <td style={st.td}>{fmt(row.venta)}</td>
                <td style={{ ...st.td, color: "#4ade80", fontWeight: 600 }}>{fmt(row.ganancia)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={st.section}>
        <h3 style={st.sectionTitle}>Distribucion de ganancias</h3>
        {categoriasData.map((row) => {
          const pct = Math.round((row.ganancia / maxGanancia) * 100);
          return (
            <div key={row.categoria} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#d1d5db", fontSize: 14 }}>{row.categoria}</span>
                <span style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>{fmt(row.ganancia)}</span>
              </div>
              <div style={st.barTrack}><div style={{ ...st.barFill, width: pct + "%" }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RF 2.2 — Rotacion ───────────────────────────────────────────────────────
function TabRotacion() {
  const masVendidos = [...productosMasVendidos].sort((a, b) => b.vendidos - a.vendidos).slice(0, 4);
  const bajaRotacion = productosMasVendidos.filter((p) => p.rotacion === "Baja");
  const maxV = Math.max(...productosMasVendidos.map((p) => p.vendidos));

  const badgeStyle = (rot) =>
    rot === "Alta"  ? { background: "#14532d", color: "#4ade80" } :
    rot === "Media" ? { background: "#713f12", color: "#fbbf24" } :
                      { background: "#7f1d1d", color: "#f87171" };

  return (
    <div style={st.tabContent}>
      <div style={st.rotGrid}>
        <div style={st.section}>
          <h3 style={{ ...st.sectionTitle, color: "#4ade80" }}>Productos mas vendidos</h3>
          <table style={st.table}>
            <thead>
              <tr>{["ID", "Producto", "Categoria", "Vendidos", "Rotacion"].map((h) => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {masVendidos.map((p, i) => (
                <tr key={p.id} style={i % 2 === 0 ? st.trEven : st.trOdd}>
                  <td style={{ ...st.td, color: "#9ca3af", fontSize: 12 }}>{p.id}</td>
                  <td style={{ ...st.td, fontWeight: 600 }}>{p.nombre}</td>
                  <td style={st.td}>{p.categoria}</td>
                  <td style={{ ...st.td, color: "#4ade80", fontWeight: 700 }}>{p.vendidos}</td>
                  <td style={st.td}>
                    <span style={{ ...badgeStyle(p.rotacion), borderRadius: 4, padding: "2px 8px", fontSize: 12 }}>{p.rotacion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={st.section}>
          <h3 style={{ ...st.sectionTitle, color: "#f87171" }}>Productos sin movimiento</h3>
          {bajaRotacion.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 14 }}>Sin productos de baja rotacion este mes.</p>
          ) : (
            <table style={st.table}>
              <thead>
                <tr>{["ID", "Producto", "Categoria", "Vendidos"].map((h) => <th key={h} style={st.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {bajaRotacion.map((p, i) => (
                  <tr key={p.id} style={i % 2 === 0 ? st.trEven : st.trOdd}>
                    <td style={{ ...st.td, color: "#9ca3af", fontSize: 12 }}>{p.id}</td>
                    <td style={{ ...st.td, fontWeight: 600 }}>{p.nombre}</td>
                    <td style={st.td}>{p.categoria}</td>
                    <td style={{ ...st.td, color: "#f87171", fontWeight: 700 }}>{p.vendidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={st.section}>
        <h3 style={st.sectionTitle}>Volumen de ventas por producto</h3>
        {[...productosMasVendidos].sort((a, b) => b.vendidos - a.vendidos).map((p) => {
          const col = badgeStyle(p.rotacion).color;
          return (
            <div key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: "#d1d5db", fontSize: 13 }}>{p.nombre}</span>
                <span style={{ color: col, fontSize: 13, fontWeight: 600 }}>{p.vendidos} uds</span>
              </div>
              <div style={st.barTrack}><div style={{ ...st.barFill, width: Math.round((p.vendidos / maxV) * 100) + "%", background: col }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RF 2.3 — Roles y permisos ───────────────────────────────────────────────
const permisosKeys = ["verReportes", "realizarVentas", "anularVentas", "cambiarPrecios"];
const permisosLabel = { verReportes: "Ver reportes", realizarVentas: "Realizar ventas", anularVentas: "Anular ventas", cambiarPrecios: "Cambiar precios" };

function TabRoles() {
  const [usuarios, setUsuarios] = useState(usuariosData);
  const [editId, setEditId] = useState(null);
  const [nuevoRol, setNuevoRol] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: "", rol: "Vendedor" });
  const [msg, setMsg] = useState(null);

  const notify = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg(null), 2800); };

  const startEdit = (u) => { setEditId(u.id); setNuevoRol(u.rol); };
  const saveEdit = (id) => {
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, rol: nuevoRol, permisos: { ...PERMISOS_DEFAULT[nuevoRol] } } : u));
    setEditId(null);
    notify("Rol actualizado correctamente.");
  };
  const togglePermiso = (id, perm) => {
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, permisos: { ...u.permisos, [perm]: !u.permisos[perm] } } : u));
  };
  const agregarUsuario = () => {
    if (!form.nombre.trim()) return notify("El nombre es requerido.", false);
    const newId = "U" + String(usuarios.length + 1).padStart(3, "0");
    setUsuarios((prev) => [...prev, { id: newId, nombre: form.nombre, rol: form.rol, permisos: { ...PERMISOS_DEFAULT[form.rol] } }]);
    setForm({ nombre: "", rol: "Vendedor" });
    setShowModal(false);
    notify("Usuario agregado correctamente.");
  };
  const eliminar = (id) => { setUsuarios((prev) => prev.filter((u) => u.id !== id)); notify("Usuario eliminado."); };

  return (
    <div style={st.tabContent}>
      {msg && (
        <div style={{ border: "1px solid", borderRadius: 7, padding: "10px 16px", marginBottom: 14, fontSize: 13, fontWeight: 500,
          background: msg.ok ? "#14532d" : "#7f1d1d", borderColor: msg.ok ? "#4ade80" : "#f87171", color: msg.ok ? "#4ade80" : "#f87171" }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ ...st.sectionTitle, margin: 0 }}>Usuarios y permisos</h3>
        <button style={st.btnPrimary} onClick={() => setShowModal(true)}>+ Nuevo usuario</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ ...st.table, minWidth: 720 }}>
          <thead>
            <tr>
              <th style={st.th}>ID</th>
              <th style={st.th}>Nombre</th>
              <th style={st.th}>Rol</th>
              {permisosKeys.map((k) => <th key={k} style={{ ...st.th, textAlign: "center" }}>{permisosLabel[k]}</th>)}
              <th style={st.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={u.id} style={i % 2 === 0 ? st.trEven : st.trOdd}>
                <td style={{ ...st.td, color: "#9ca3af", fontSize: 12 }}>{u.id}</td>
                <td style={{ ...st.td, fontWeight: 600 }}>{u.nombre}</td>
                <td style={st.td}>
                  {editId === u.id ? (
                    <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)} style={st.select}>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span style={{ background: u.rol === "Administrador" ? "#1e3a5f" : "#1c2e1c", color: u.rol === "Administrador" ? "#60a5fa" : "#4ade80", borderRadius: 4, padding: "2px 8px", fontSize: 12 }}>
                      {u.rol}
                    </span>
                  )}
                </td>
                {permisosKeys.map((k) => (
                  <td key={k} style={{ ...st.td, textAlign: "center" }}>
                    <input type="checkbox" checked={u.permisos[k]} onChange={() => togglePermiso(u.id, k)}
                      style={{ accentColor: "#4ade80", width: 16, height: 16, cursor: "pointer" }} />
                  </td>
                ))}
                <td style={{ ...st.td, whiteSpace: "nowrap" }}>
                  {editId === u.id ? (
                    <>
                      <button style={{ ...st.btnSm, marginRight: 6 }} onClick={() => saveEdit(u.id)}>Guardar</button>
                      <button style={{ ...st.btnSm, background: "#374151", color: "#d1d5db" }} onClick={() => setEditId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button style={{ ...st.btnSm, marginRight: 6 }} onClick={() => startEdit(u)}>Editar rol</button>
                      <button style={{ ...st.btnSm, background: "#7f1d1d", color: "#f87171" }} onClick={() => eliminar(u.id)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...st.section, marginTop: 24 }}>
        <h3 style={st.sectionTitle}>Definicion de roles</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {ROLES.map((rol) => (
            <div key={rol} style={{ background: "#111827", borderRadius: 8, padding: 16, border: "1px solid #374151" }}>
              <h4 style={{ margin: "0 0 10px", color: rol === "Administrador" ? "#60a5fa" : "#4ade80", fontSize: 15 }}>
                {rol === "Administrador" ? "Administrador - acceso total" : "Vendedor - solo ventas"}
              </h4>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#d1d5db", fontSize: 13, lineHeight: 2 }}>
                {permisosKeys.map((k) => (
                  <li key={k} style={{ color: PERMISOS_DEFAULT[rol][k] ? "#4ade80" : "#6b7280" }}>
                    {PERMISOS_DEFAULT[rol][k] ? "✓" : "✗"} {permisosLabel[k]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={st.overlay} onClick={() => setShowModal(false)}>
          <div style={st.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", color: "#f9fafb" }}>Agregar usuario</h3>
            <label style={st.label}>Nombre completo</label>
            <input style={st.input} placeholder="Ej: Juan Garcia" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <label style={{ ...st.label, marginTop: 12 }}>Rol</label>
            <select style={st.select} value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={st.btnPrimary} onClick={agregarUsuario}>Agregar</button>
              <button style={{ ...st.btnSm, background: "#374151", color: "#d1d5db", padding: "8px 16px" }} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente raiz ──────────────────────────────────────────────────────────
export default function Administracion() {
  const [tab, setTab] = useState("informes");
  const tabs = [
    { id: "informes", label: "Informes" },
    { id: "rotacion", label: "Rotacion de productos" },
    { id: "roles",    label: "Roles y permisos" },
  ];

  return (
    <div style={st.root}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 22 }}>⚙️</span>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f9fafb" }}>Administracion</h2>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={tab === t.id ? st.tabActive : st.tabInactive}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "informes" && <TabInformes />}
      {tab === "rotacion" && <TabRotacion />}
      {tab === "roles"    && <TabRoles />}
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const st = {
  root:       { background: "#111827", minHeight: "100vh", color: "#f9fafb", fontFamily: "'Inter','Segoe UI',sans-serif", padding: "24px 20px", maxWidth: 1100, margin: "0 auto", boxSizing: "border-box" },
  tabContent: {},
  kpiRow:     { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 },
  kpiCard:    { background: "#1f2937", border: "1px solid #374151", borderRadius: 10, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 },
  kpiLabel:   { color: "#9ca3af", fontSize: 13 },
  kpiValue:   { color: "#f9fafb", fontSize: 30, fontWeight: 800, letterSpacing: "-1px" },
  kpiValueLg: { color: "#f9fafb", fontSize: 26, fontWeight: 800 },
  kpiSub:     { color: "#6b7280", fontSize: 12 },
  section:    { background: "#1f2937", border: "1px solid #374151", borderRadius: 10, padding: "18px 20px", marginBottom: 16 },
  sectionTitle: { margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: "#e5e7eb" },
  table:      { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th:         { textAlign: "left", color: "#9ca3af", fontWeight: 500, fontSize: 13, padding: "8px 12px", borderBottom: "1px solid #374151" },
  td:         { color: "#e5e7eb", padding: "10px 12px", verticalAlign: "middle" },
  trEven:     { background: "transparent" },
  trOdd:      { background: "rgba(255,255,255,0.02)" },
  barTrack:   { height: 8, background: "#374151", borderRadius: 4, overflow: "hidden" },
  barFill:    { height: "100%", background: "#4ade80", borderRadius: 4, transition: "width .4s ease" },
  rotGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 16 },
  btnPrimary: { background: "#166534", color: "#4ade80", border: "1px solid #4ade80", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13 },
  btnSm:      { background: "#166534", color: "#4ade80", border: "none", borderRadius: 5, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  select:     { background: "#111827", color: "#f9fafb", border: "1px solid #4b5563", borderRadius: 5, padding: "5px 8px", fontSize: 13, cursor: "pointer", width: "100%" },
  input:      { background: "#111827", color: "#f9fafb", border: "1px solid #4b5563", borderRadius: 5, padding: "8px 10px", fontSize: 13, width: "100%", boxSizing: "border-box" },
  label:      { display: "block", color: "#9ca3af", fontSize: 12, marginBottom: 4 },
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:      { background: "#1f2937", border: "1px solid #374151", borderRadius: 12, padding: 28, width: "100%", maxWidth: 380 },
  tabActive:  { background: "#1f2937", color: "#f9fafb", border: "1px solid #4b5563", borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14 },
  tabInactive:{ background: "transparent", color: "#9ca3af", border: "1px solid #374151", borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontWeight: 500, fontSize: 14 },
};
ENDOFFILE
cp /home/claude/Administracion.jsx /mnt/user-data/outputs/Administracion.jsx && echo "OK"
Salida
